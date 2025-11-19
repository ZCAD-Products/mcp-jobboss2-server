import { JobBOSS2Client } from '../src/jobboss2-client';
import { orderHandlers } from '../src/tools/orders';
import { customerHandlers } from '../src/tools/customers';

// Mock the client
const mockClient = {
    getOrders: jest.fn(),
    createOrder: jest.fn(),
    getCustomers: jest.fn(),
} as unknown as JobBOSS2Client;

describe('Server Handlers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Order Handlers', () => {
        it('get_orders should call client.getOrders', async () => {
            const args = { customerCode: 'ACME', take: 10 };
            const mockResult = [{ orderNumber: '123' }];
            (mockClient.getOrders as jest.Mock).mockResolvedValue(mockResult);

            const result = await orderHandlers.get_orders(args, mockClient);

            expect(mockClient.getOrders).toHaveBeenCalledWith(args);
            expect(result).toEqual(mockResult);
        });

        it('create_order should call client.createOrder', async () => {
            const args = { customerCode: 'ACME', orderNumber: 'NEW123' };
            const mockResult = { orderNumber: 'NEW123', customerCode: 'ACME' };
            (mockClient.createOrder as jest.Mock).mockResolvedValue(mockResult);

            const result = await orderHandlers.create_order(args, mockClient);

            expect(mockClient.createOrder).toHaveBeenCalledWith(args);
            expect(result).toEqual(mockResult);
        });
    });

    describe('Customer Handlers', () => {
        it('get_customers should call client.getCustomers', async () => {
            const args = { sort: '+customerName' };
            const mockResult = [{ customerCode: 'ACME' }];
            (mockClient.getCustomers as jest.Mock).mockResolvedValue(mockResult);

            const result = await customerHandlers.get_customers(args, mockClient);

            expect(mockClient.getCustomers).toHaveBeenCalledWith(args);
            expect(result).toEqual(mockResult);
        });
    });
});
