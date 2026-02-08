import { generatedToolConfigs } from '../src/tools/generated';

type DynamicPathCase = {
    name: string;
    args: Record<string, unknown>;
    expectedPath: string;
};

const enc = (value: string | number) => encodeURIComponent(String(value));

const dynamicPathCases: DynamicPathCase[] = [
    {
        name: 'get_corrective_preventive_action_by_number',
        args: { correctiveActionNumber: 'CA/100 A' },
        expectedPath: `/api/v1/corrective-preventive-actions/${enc('CA/100 A')}`,
    },
    {
        name: 'get_gl_code_by_account',
        args: { GLAccountNumber: '4000/01 A' },
        expectedPath: `/api/v1/gl-codes/${enc('4000/01 A')}`,
    },
    {
        name: 'get_non_conformance_by_number',
        args: { ncNumber: 'NC/2026 01' },
        expectedPath: `/api/v1/non-conformances/${enc('NC/2026 01')}`,
    },
    {
        name: 'get_operation_code_by_code',
        args: { operationCode: 'OP/10 A' },
        expectedPath: `/api/v1/operation-codes/${enc('OP/10 A')}`,
    },
    {
        name: 'get_reason_code_by_id',
        args: { uniqueID: 'RC/11 A' },
        expectedPath: `/api/v1/reason-codes/${enc('RC/11 A')}`,
    },
    {
        name: 'get_tax_code_by_code',
        args: { taxCode: 'TAX/CA 1' },
        expectedPath: `/api/v1/tax-codes/${enc('TAX/CA 1')}`,
    },
    {
        name: 'get_terms_by_code',
        args: { termsCode: 'NET/30 A' },
        expectedPath: `/api/v1/terms/${enc('NET/30 A')}`,
    },
    {
        name: 'get_shipping_address_by_id',
        args: { customerCode: 'ACME / WEST', location: 'MAIN DOCK' },
        expectedPath: `/api/v1/shipping-addresses/${enc('ACME / WEST')}/${enc('MAIN DOCK')}`,
    },
    {
        name: 'update_shipping_address',
        args: { customerCode: 'ACME / WEST', location: 'MAIN DOCK', city: 'Denver' },
        expectedPath: `/api/v1/shipping-addresses/${enc('ACME / WEST')}/${enc('MAIN DOCK')}`,
    },
    {
        name: 'get_contact_by_id',
        args: { object: 'Customer/Division', contactCode: 'C 100/200', contact: 'John Doe' },
        expectedPath: `/api/v1/contacts/${enc('Customer/Division')}/${enc('C 100/200')}/${enc('John Doe')}`,
    },
    {
        name: 'update_contact',
        args: { object: 'Customer/Division', contactCode: 'C 100/200', contact: 'John Doe', phone: '555-0100' },
        expectedPath: `/api/v1/contacts/${enc('Customer/Division')}/${enc('C 100/200')}/${enc('John Doe')}`,
    },
    {
        name: 'update_vendor',
        args: { vendorCode: 'V/100 A', active: true },
        expectedPath: `/api/v1/vendors/${enc('V/100 A')}`,
    },
    {
        name: 'update_work_center',
        args: { workCenter: 'WC/10 A', active: true },
        expectedPath: `/api/v1/work-centers/${enc('WC/10 A')}`,
    },
    {
        name: 'update_employee',
        args: { employeeCode: 'EMP/7 A', active: true },
        expectedPath: `/api/v1/employees/${enc('EMP/7 A')}`,
    },
    {
        name: 'update_salesperson',
        args: { salesID: 'SLS/9 A', active: true },
        expectedPath: `/api/v1/salespersons/${enc('SLS/9 A')}`,
    },
    {
        name: 'update_purchase_order',
        args: { poNumber: 'PO/55 A', status: 'Open' },
        expectedPath: `/api/v1/purchase-orders/${enc('PO/55 A')}`,
    },
    {
        name: 'update_purchase_order_line_item',
        args: {
            purchaseOrderNumber: 'PO/55 A',
            partNumber: 'PART/ABC 10',
            itemNumber: '1/2',
            quantityOrdered: 5,
        },
        expectedPath: `/api/v1/purchase-order-line-items/${enc('PO/55 A')}/${enc('PART/ABC 10')}/${enc('1/2')}`,
    },
    {
        name: 'update_time_ticket',
        args: { ticketDate: '2026-01-31', employeeCode: 'EMP/8 A', comments: 'update' },
        expectedPath: `/api/v1/time-tickets/${enc('2026-01-31')}/employees/${enc('EMP/8 A')}`,
    },
    {
        name: 'update_time_ticket_detail',
        args: { timeTicketGUID: 'GUID/with space', comments: 'update' },
        expectedPath: `/api/v1/time-ticket-details/${enc('GUID/with space')}`,
    },
];

describe('Generated tool handlers', () => {
    it.each(dynamicPathCases)('encodes path segments for $name', async ({ name, args, expectedPath }) => {
        const config = generatedToolConfigs.find((toolConfig) => toolConfig.name === name);
        if (!config) {
            throw new Error(`Missing generated tool config for ${name}`);
        }

        const mockClient = {
            apiCall: jest.fn().mockResolvedValue({ ok: true }),
        };

        await config.handler(args, mockClient as any);

        expect(mockClient.apiCall).toHaveBeenCalledTimes(1);
        const firstCallArgs = (mockClient.apiCall as jest.Mock).mock.calls[0];
        expect(firstCallArgs[1]).toBe(expectedPath);
    });
});
