import { JobBOSS2Client } from '../jobboss2-client.js';
import { ToolDefinition } from './tool-definition.js';
import {
    GetQuotesSchema,
    GetQuoteByIdSchema,
    CreateQuoteSchema,
    UpdateQuoteSchema,
    GetQuoteLineItemsSchema,
    GetQuoteLineItemByIdSchema,
    CreateQuoteLineItemSchema,
    UpdateQuoteLineItemSchema,
} from '../schemas.js';

export const quoteTools: ToolDefinition[] = [
    {
        name: 'get_quotes',
        description: 'Retrieve a list of quotes from JobBOSS2. Supports filtering, sorting, pagination, and field selection.',
    },
    {
        name: 'get_quote_by_id',
        description: 'Retrieve a specific quote by its quote number.',
    },
    {
        name: 'create_quote',
        description: 'Create a new quote in JobBOSS2.',
    },
    {
        name: 'update_quote',
        description: 'Update an existing quote in JobBOSS2.',
    },
    {
        name: 'get_quote_line_items',
        description: 'Retrieve quote line items across all quotes. Filter by quoteNumber, partNumber, status, etc.',
    },
    {
        name: 'get_quote_line_item_by_id',
        description: 'Retrieve a specific quote line item using quote number and line item number.',
    },
    {
        name: 'create_quote_line_item',
        description: 'Create a new quote line item. Provide any JobBOSS2 quote line item fields (pricing, quantities, work code, etc.).',
    },
    {
        name: 'update_quote_line_item',
        description: 'Update an existing quote line item by quote number and item number. Supply any fields to patch.',
    },
];

export const quoteHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    get_quotes: async (args, client) => {
        const params = GetQuotesSchema.parse(args);
        return client.getQuotes(params);
    },
    get_quote_by_id: async (args, client) => {
        const { quoteNumber, fields } = GetQuoteByIdSchema.parse(args);
        return client.getQuoteById(quoteNumber, { fields });
    },
    create_quote: async (args, client) => {
        const quoteData = CreateQuoteSchema.parse(args);
        return client.createQuote(quoteData);
    },
    update_quote: async (args, client) => {
        const { quoteNumber, ...updateData } = UpdateQuoteSchema.parse(args);
        return client.updateQuote(quoteNumber, updateData);
    },
    get_quote_line_items: async (args, client) => {
        const params = GetQuoteLineItemsSchema.parse(args);
        return client.getQuoteLineItems(params);
    },
    get_quote_line_item_by_id: async (args, client) => {
        const { quoteNumber, itemNumber, fields } = GetQuoteLineItemByIdSchema.parse(args);
        return client.getQuoteLineItem(quoteNumber, itemNumber, { fields });
    },
    create_quote_line_item: async (args, client) => {
        const { quoteNumber, ...payload } = CreateQuoteLineItemSchema.parse(args);
        return client.createQuoteLineItem(quoteNumber, payload);
    },
    update_quote_line_item: async (args, client) => {
        const { quoteNumber, itemNumber, ...payload } = UpdateQuoteLineItemSchema.parse(args);
        return client.updateQuoteLineItem(quoteNumber, itemNumber, payload);
    },
};
