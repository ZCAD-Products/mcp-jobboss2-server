import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { JobBOSS2Client } from '../jobboss2-client.js';
import {
    GetOrdersSchema,
    GetOrderByIdSchema,
    CreateOrderSchema,
    UpdateOrderSchema,
    GetOrderLineItemsSchema,
    GetOrderLineItemByIdSchema,
    CreateOrderLineItemSchema,
    UpdateOrderLineItemSchema,
    GetOrderRoutingsSchema,
    GetOrderRoutingByKeysSchema,
    CreateOrderRoutingSchema,
    UpdateOrderRoutingSchema,
} from '../schemas.js';

export const orderTools: Tool[] = [
    {
        name: 'get_orders',
        description: 'Retrieve a list of orders from JobBOSS2. Supports filtering, sorting, pagination, and field selection. Example filters: customerCode=ACME, status[in]=Open|InProgress, orderTotal[gte]=1000',
        inputSchema: {
            type: 'object',
            properties: {
                fields: { type: 'string', description: 'Comma-separated list of fields (e.g., orderNumber,customerCode,orderTotal)' },
                sort: { type: 'string', description: 'Sort expression (e.g., -dateEntered for descending, +orderNumber for ascending)' },
                skip: { type: 'number', description: 'Skip N records (pagination)' },
                take: { type: 'number', description: 'Take N records (pagination, default 200)' },
            },
            additionalProperties: true,
        },
    },
    {
        name: 'get_order_by_id',
        description: 'Retrieve a specific order by its order number.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number to retrieve' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' },
            },
            required: ['orderNumber'],
        },
    },
    {
        name: 'create_order',
        description: 'Create a new order in JobBOSS2.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'Order number (optional if auto-numbering enabled)' },
                customerCode: { type: 'string', description: 'Customer code' },
                PONumber: { type: 'string', description: 'Purchase order number' },
                status: { type: 'string', description: 'Order status' },
                dueDate: { type: 'string', description: 'Due date (ISO format: yyyy-MM-dd)' },
            },
            required: ['customerCode'],
            additionalProperties: true,
        },
    },
    {
        name: 'update_order',
        description: 'Update an existing order in JobBOSS2.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number to update' },
                customerCode: { type: 'string', description: 'Customer code' },
                PONumber: { type: 'string', description: 'Purchase order number' },
                status: { type: 'string', description: 'Order status' },
                dueDate: { type: 'string', description: 'Due date (ISO format: yyyy-MM-dd)' },
            },
            required: ['orderNumber'],
            additionalProperties: true,
        },
    },
    {
        name: 'get_order_line_items',
        description: 'Retrieve line items for a specific order.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' },
            },
            required: ['orderNumber'],
        },
    },
    {
        name: 'get_order_line_item_by_id',
        description: 'Retrieve a specific order line item.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                itemNumber: { type: 'number', description: 'The line item number' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' },
            },
            required: ['orderNumber', 'itemNumber'],
        },
    },
    {
        name: 'create_order_line_item',
        description: 'Create a new line item for an order.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                partNumber: { type: 'string', description: 'Part number' },
                description: { type: 'string', description: 'Item description' },
                quantity: { type: 'number', description: 'Quantity' },
                price: { type: 'number', description: 'Price per unit' },
            },
            required: ['orderNumber'],
            additionalProperties: true,
        },
    },
    {
        name: 'update_order_line_item',
        description: 'Update an existing order line item.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                itemNumber: { type: 'number', description: 'The line item number' },
                partNumber: { type: 'string', description: 'Part number' },
                description: { type: 'string', description: 'Item description' },
                quantity: { type: 'number', description: 'Quantity' },
                price: { type: 'number', description: 'Price per unit' },
            },
            required: ['orderNumber', 'itemNumber'],
            additionalProperties: true,
        },
    },
    {
        name: 'get_order_routings',
        description: 'Retrieve a list of order routings from JobBOSS2 with optional filtering, sorting, and pagination.',
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
        name: 'get_order_routing',
        description: 'Retrieve a specific order routing by order number, line item, and step.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                itemNumber: { type: 'number', description: 'The line item number' },
                stepNumber: { type: 'number', description: 'The routing step number' },
                fields: { type: 'string', description: 'Comma-separated list of fields to return' },
            },
            required: ['orderNumber', 'itemNumber', 'stepNumber'],
        },
    },
    {
        name: 'create_order_routing',
        description: 'Create a new routing for a specific order line item.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                itemNumber: { type: 'number', description: 'The line item number' },
                certificationRequired: { type: 'boolean', description: 'Whether the routing requires certification' },
                cyclePrice: { type: 'number', description: 'Cycle price' },
                cycleTime: { type: 'number', description: 'Cycle time' },
                cycleUnit: { type: 'string', description: 'Cycle time unit' },
                departmentNumber: { type: 'string', description: 'Department number' },
                description: { type: 'string', description: 'Routing description' },
                employeeCode: { type: 'string', description: 'Employee code' },
                estimatedEndDate: { type: 'string', description: 'Estimated end date (ISO format)' },
                estimatedQuantity: { type: 'number', description: 'Estimated quantity' },
                estimatedStartDate: { type: 'string', description: 'Estimated start date (ISO format)' },
                ignoreVendorMinimum: { type: 'boolean', description: 'Ignore vendor minimums' },
                operationCode: { type: 'string', description: 'Routing operation code' },
                overlapSteps: { type: 'boolean', description: 'Allow overlapping steps' },
                setupPrice: { type: 'number', description: 'Setup price' },
                setupTime: { type: 'number', description: 'Setup time' },
                shift2DefaultEmployeeCode: { type: 'string', description: 'Shift 2 default employee code' },
                shift3DefaultEmployeeCode: { type: 'string', description: 'Shift 3 default employee code' },
                stepNumber: { type: 'number', description: 'Routing step number' },
                timeUnit: { type: 'string', description: 'Time unit' },
                total: { type: 'number', description: 'Total cost' },
                vendorCode: { type: 'string', description: 'Vendor code' },
                workCenter: { type: 'string', description: 'Work center assigned' },
                workCenterOrVendor: { type: 'string', description: 'Work center or vendor identifier' },
            },
            required: ['orderNumber', 'itemNumber', 'workCenterOrVendor'],
            additionalProperties: true,
        },
    },
    {
        name: 'update_order_routing',
        description: 'Update an existing order routing.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'The order number' },
                itemNumber: { type: 'number', description: 'The line item number' },
                stepNumber: { type: 'number', description: 'The routing step number' },
                operationCode: { type: 'string', description: 'Routing operation code' },
                employeeCode: { type: 'string', description: 'Employee code' },
                estimatedEndDate: { type: 'string', description: 'Estimated end date (ISO format)' },
                estimatedStartDate: { type: 'string', description: 'Estimated start date (ISO format)' },
                workCenter: { type: 'string', description: 'Work center assigned' },
            },
            required: ['orderNumber', 'itemNumber', 'stepNumber'],
            additionalProperties: true,
        },
    },
    {
        name: 'create_order_release',
        description: 'Create a release for a specific order line item.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'Order number' },
                itemNumber: {
                    oneOf: [{ type: 'string' }, { type: 'number' }],
                    description: 'Order line item number',
                },
            },
            required: ['orderNumber', 'itemNumber'],
            additionalProperties: true,
        },
    },
    {
        name: 'get_order_release_by_id',
        description: 'Retrieve a specific release for an order line item by unique ID.',
        inputSchema: {
            type: 'object',
            properties: {
                orderNumber: { type: 'string', description: 'Order number' },
                itemNumber: {
                    oneOf: [{ type: 'string' }, { type: 'number' }],
                    description: 'Order line item number',
                },
                uniqueID: {
                    oneOf: [{ type: 'string' }, { type: 'number' }],
                    description: 'Release unique ID',
                },
                fields: { type: 'string', description: 'Optional comma-separated fields' },
            },
            required: ['orderNumber', 'itemNumber', 'uniqueID'],
        },
    },
];

export const orderHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    get_orders: async (args, client) => {
        const params = GetOrdersSchema.parse(args);
        return client.getOrders(params);
    },
    get_order_by_id: async (args, client) => {
        const { orderNumber, fields } = GetOrderByIdSchema.parse(args);
        return client.getOrderById(orderNumber, { fields });
    },
    create_order: async (args, client) => {
        const orderData = CreateOrderSchema.parse(args);
        return client.createOrder(orderData);
    },
    update_order: async (args, client) => {
        const { orderNumber, ...updateData } = UpdateOrderSchema.parse(args);
        return client.updateOrder(orderNumber, updateData);
    },
    get_order_line_items: async (args, client) => {
        const { orderNumber, fields } = GetOrderLineItemsSchema.parse(args);
        return client.getOrderLineItems(orderNumber, { fields });
    },
    get_order_line_item_by_id: async (args, client) => {
        const { orderNumber, itemNumber, fields } = GetOrderLineItemByIdSchema.parse(args);
        return client.getOrderLineItemById(orderNumber, itemNumber, { fields });
    },
    create_order_line_item: async (args, client) => {
        const { orderNumber, ...itemData } = CreateOrderLineItemSchema.parse(args);
        return client.createOrderLineItem(orderNumber, itemData);
    },
    update_order_line_item: async (args, client) => {
        const { orderNumber, itemNumber, ...updateData } = UpdateOrderLineItemSchema.parse(args);
        return client.updateOrderLineItem(orderNumber, itemNumber, updateData);
    },
    get_order_routings: async (args, client) => {
        const params = GetOrderRoutingsSchema.parse(args);
        return client.getOrderRoutings(params);
    },
    get_order_routing: async (args, client) => {
        const { orderNumber, itemNumber, stepNumber, fields } = GetOrderRoutingByKeysSchema.parse(args);
        return client.getOrderRouting(orderNumber, itemNumber, stepNumber, { fields });
    },
    create_order_routing: async (args, client) => {
        const { orderNumber, itemNumber, ...routingData } = CreateOrderRoutingSchema.parse(args);
        return client.createOrderRouting(orderNumber, itemNumber, routingData);
    },
    update_order_routing: async (args, client) => {
        const { orderNumber, itemNumber, stepNumber, ...updateData } = UpdateOrderRoutingSchema.parse(args);
        return client.updateOrderRouting(orderNumber, itemNumber, stepNumber, updateData);
    },
    create_order_release: async (args, client) => {
        const { orderNumber, itemNumber, ...payload } = args; // Schema validation can be added if strict schema exists
        return client.apiCall('POST', `/api/v1/orders/${orderNumber}/order-line-items/${itemNumber}/releases`, payload);
    },
    get_order_release_by_id: async (args, client) => {
        const { orderNumber, itemNumber, uniqueID, fields } = args;
        return client.apiCall(
            'GET',
            `/api/v1/orders/${orderNumber}/order-line-items/${itemNumber}/releases/${uniqueID}`,
            undefined,
            fields ? { fields } : undefined
        );
    },
};
