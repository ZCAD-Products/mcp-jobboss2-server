import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { JobBOSS2Client } from '../jobboss2-client.js';
import {
    GetCustomersSchema,
    GetCustomerByIdSchema,
    CreateCustomerSchema,
    UpdateCustomerSchema,
} from '../schemas.js';

export const customerTools: Tool[] = [
    {
        name: 'get_customers',
        description: 'Retrieve a list of customers from JobBOSS2. Supports filtering, sorting, pagination, and field selection.',
        inputSchema: {
            type: 'object',
            properties: {
                fields: { type: 'string', description: 'Comma-separated list of fields' },
                sort: { type: 'string', description: 'Sort expression' },
                skip: { type: 'number', description: 'Skip N records' },
                take: { type: 'number', description: 'Take N records' },
            },
            additionalProperties: true,
        },
    },
    {
        name: 'get_customer_by_code',
        description: 'Retrieve a specific customer by their customer code.',
        inputSchema: {
            type: 'object',
            properties: {
                customerCode: { type: 'string', description: 'The customer code to retrieve' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' },
            },
            required: ['customerCode'],
        },
    },
    {
        name: 'create_customer',
        description: 'Create a new customer in JobBOSS2.',
        inputSchema: {
            type: 'object',
            properties: {
                customerCode: { type: 'string', description: 'Customer code' },
                customerName: { type: 'string', description: 'Customer name' },
                phone: { type: 'string', description: 'Phone number' },
                billingAddress1: { type: 'string', description: 'Billing address' },
            },
            required: ['customerCode', 'customerName'],
            additionalProperties: true,
        },
    },
    {
        name: 'update_customer',
        description: 'Update an existing customer in JobBOSS2.',
        inputSchema: {
            type: 'object',
            properties: {
                customerCode: { type: 'string', description: 'The customer code to update' },
                customerName: { type: 'string', description: 'Customer name' },
                phone: { type: 'string', description: 'Phone number' },
                billingAddress1: { type: 'string', description: 'Billing address' },
            },
            required: ['customerCode'],
            additionalProperties: true,
        },
    },
];

export const customerHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    get_customers: async (args, client) => {
        const params = GetCustomersSchema.parse(args);
        return client.getCustomers(params);
    },
    get_customer_by_code: async (args, client) => {
        const { customerCode, fields } = GetCustomerByIdSchema.parse(args);
        return client.getCustomerById(customerCode, { fields });
    },
    create_customer: async (args, client) => {
        const customerData = CreateCustomerSchema.parse(args);
        return client.createCustomer(customerData);
    },
    update_customer: async (args, client) => {
        const { customerCode, ...updateData } = UpdateCustomerSchema.parse(args);
        return client.updateCustomer(customerCode, updateData);
    },
};
