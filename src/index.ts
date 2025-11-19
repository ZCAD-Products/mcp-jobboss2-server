#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { JobBOSS2Client } from './jobboss2-client.js';

// Import tools and handlers
import { orderTools, orderHandlers } from './tools/orders.js';
import { customerTools, customerHandlers } from './tools/customers.js';
import { quoteTools, quoteHandlers } from './tools/quotes.js';
import { inventoryTools, inventoryHandlers } from './tools/inventory.js';
import { productionTools, productionHandlers } from './tools/production.js';
import { employeeTools, employeeHandlers } from './tools/employees.js';
import { generalTools, generalHandlers } from './tools/general.js';
import { generatedToolConfigs } from './tools/generated.js';

// Load environment variables
dotenv.config();

const API_URL = process.env.JOBBOSS2_API_URL;
const API_KEY = process.env.JOBBOSS2_API_KEY;
const API_SECRET = process.env.JOBBOSS2_API_SECRET;
const TOKEN_URL = process.env.JOBBOSS2_OAUTH_TOKEN_URL;
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10);

if (!API_URL || !API_KEY || !API_SECRET || !TOKEN_URL) {
  console.error('Error: Missing required environment variables');
  process.exit(1);
}

const jobboss2Client = new JobBOSS2Client({
  apiUrl: API_URL,
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  tokenUrl: TOKEN_URL,
  timeout: API_TIMEOUT,
});

const server = new Server(
  {
    name: 'mcp-jobboss2-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Aggregate tools
const generatedTools: Tool[] = generatedToolConfigs.map(({ name, description, inputSchema }) => ({
  name,
  description,
  inputSchema,
}));

const tools: Tool[] = [
  ...orderTools,
  ...customerTools,
  ...quoteTools,
  ...inventoryTools,
  ...productionTools,
  ...employeeTools,
  ...generalTools,
  ...generatedTools,
];

// Aggregate handlers
const generatedHandlers = Object.fromEntries(
  generatedToolConfigs.map((config) => [config.name, config.handler])
);

const allHandlers = {
  ...orderHandlers,
  ...customerHandlers,
  ...quoteHandlers,
  ...inventoryHandlers,
  ...productionHandlers,
  ...employeeHandlers,
  ...generalHandlers,
  ...generatedHandlers,
};

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = allHandlers[name];

  if (!handler) {
    throw new Error(`Tool not found: ${name}`);
  }

  try {
    const result = await handler(args, jobboss2Client);

    // Check if the tool config has a success message generator (only for generated tools currently)
    // For other tools, we just return the JSON result.
    // If we wanted to support success messages for all tools, we'd need to standardize the handler return type or metadata.
    // The original implementation returned: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    // Some tools had custom success messages.
    // Let's check if it's a generated tool with a success message
    const generatedConfig = generatedToolConfigs.find((c) => c.name === name);
    if (generatedConfig?.successMessage) {
      return {
        content: [{ type: 'text', text: generatedConfig.successMessage(args) }],
      };
    }

    // Default response format
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [{ type: 'text', text: `Error: ${error.message}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: 'text', text: `Error: ${String(error)}` }],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('JobBOSS2 MCP Server running on stdio');
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
