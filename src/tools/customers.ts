import { JobBOSS2Client } from '../jobboss2-client.js';
import { ToolDefinition } from './tool-definition.js';
import {
    GetCustomersSchema,
    GetCustomerByIdSchema,
    CreateCustomerSchema,
    UpdateCustomerSchema,
} from '../schemas.js';

export const customerTools: ToolDefinition[] = [
    {
        name: 'get_customers',
        description: 'Retrieve a list of customers from JobBOSS2. Supports filtering, sorting, pagination, and field selection.',
    },
    {
        name: 'get_customer_by_code',
        description: 'Retrieve a specific customer by their customer code.',
    },
    {
        name: 'create_customer',
        description: 'Create a new customer in JobBOSS2.',
    },
    {
        name: 'update_customer',
        description: 'Update an existing customer in JobBOSS2.',
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
