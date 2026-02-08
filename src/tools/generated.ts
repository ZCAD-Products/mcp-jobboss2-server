import { z } from 'zod';
import { JobBOSS2Client } from '../jobboss2-client.js';
import {
    QueryParamsSchema,
    NoInputSchema,
    AnyObjectSchema,
} from '../schemas.js';

export type GeneratedToolConfig = {
    name: string;
    description: string;
    schema: z.ZodTypeAny;
    handler: (parsedArgs: any, client: JobBOSS2Client) => Promise<any>;
    successMessage?: (parsedArgs: any) => string;
};

const createListToolConfig = (name: string, description: string, path: string): GeneratedToolConfig => ({
    name,
    description,
    schema: QueryParamsSchema,
    handler: async (params: any, client: JobBOSS2Client) => client.apiCall('GET', path, undefined, params),
});

const createNoInputGetToolConfig = (name: string, description: string, path: string): GeneratedToolConfig => ({
    name,
    description,
    schema: NoInputSchema,
    handler: async (_: any, client: JobBOSS2Client) => client.apiCall('GET', path),
});

const encodePathSegment = (value: string | number): string => encodeURIComponent(String(value));

export const generatedToolConfigs: GeneratedToolConfig[] = [
    createListToolConfig('get_ar_invoice_details', 'Retrieve AR invoice detail rows with filtering and pagination.', '/api/v1/ar-invoice-details'),
    createListToolConfig('get_ar_invoices', 'Retrieve AR invoices with optional filters such as customer, date, or status.', '/api/v1/ar-invoices'),
    createListToolConfig('get_company_calendars', 'Retrieve company calendar definitions and capacities.', '/api/v1/company-calendars'),
    createListToolConfig('get_corrective_preventive_actions', 'Retrieve corrective and preventive action records.', '/api/v1/corrective-preventive-actions'),
    {
        name: 'get_corrective_preventive_action_by_number',
        description: 'Retrieve a specific corrective/preventive action by its number.',
        schema: z.object({
            correctiveActionNumber: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ correctiveActionNumber, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/corrective-preventive-actions/${encodePathSegment(correctiveActionNumber)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_currency_codes', 'Retrieve supported currency codes.', '/api/v1/currency-codes'),
    createListToolConfig('get_customer_returns', 'Retrieve customer return headers.', '/api/v1/customer-returns'),
    createListToolConfig('get_customer_return_releases', 'Retrieve customer return releases.', '/api/v1/customer-return-releases'),
    createListToolConfig('get_customer_return_line_items', 'Retrieve customer return line items.', '/api/v1/customer-return-line-items'),
    createListToolConfig('get_departments', 'Retrieve department master records.', '/api/v1/departments'),
    createListToolConfig('get_employee_trainings', 'Retrieve employee training records.', '/api/v1/employee-trainings'),
    createListToolConfig('get_feedback', 'Retrieve feedback records.', '/api/v1/feedback'),
    createListToolConfig('get_gl_codes', 'Retrieve GL codes.', '/api/v1/gl-codes'),
    {
        name: 'get_gl_code_by_account',
        description: 'Retrieve a GL code by account number.',
        schema: z.object({
            GLAccountNumber: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ GLAccountNumber, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/gl-codes/${encodePathSegment(GLAccountNumber)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_non_conformances', 'Retrieve non-conformance records.', '/api/v1/non-conformances'),
    {
        name: 'get_non_conformance_by_number',
        description: 'Retrieve a specific non-conformance by number.',
        schema: z.object({
            ncNumber: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ ncNumber, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/non-conformances/${encodePathSegment(ncNumber)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_operation_codes', 'Retrieve operation codes.', '/api/v1/operation-codes'),
    {
        name: 'get_operation_code_by_code',
        description: 'Retrieve an operation code by its identifier.',
        schema: z.object({
            operationCode: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ operationCode, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/operation-codes/${encodePathSegment(operationCode)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_all_order_line_items', 'Retrieve order line items across all orders.', '/api/v1/order-line-items'),
    createListToolConfig('get_reason_codes', 'Retrieve reason codes.', '/api/v1/reason-codes'),
    {
        name: 'get_reason_code_by_id',
        description: 'Retrieve a reason code by unique ID.',
        schema: z.object({
            uniqueID: z.union([z.number(), z.string()]),
            fields: z.string().optional(),
        }),
        handler: async ({ uniqueID, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/reason-codes/${encodePathSegment(uniqueID)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_releases', 'Retrieve release schedules across orders.', '/api/v1/releases'),
    createListToolConfig('get_shipping_addresses', 'Retrieve shipping addresses for customers.', '/api/v1/shipping-addresses'),
    createListToolConfig('get_tax_codes', 'Retrieve tax codes.', '/api/v1/tax-codes'),
    {
        name: 'get_tax_code_by_code',
        description: 'Retrieve a tax code by identifier.',
        schema: z.object({
            taxCode: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ taxCode, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/tax-codes/${encodePathSegment(taxCode)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_terms', 'Retrieve payment terms codes.', '/api/v1/terms'),
    {
        name: 'get_terms_by_code',
        description: 'Retrieve a terms record by code.',
        schema: z.object({
            termsCode: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ termsCode, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/terms/${encodePathSegment(termsCode)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    createListToolConfig('get_tooling_maintenance', 'Retrieve tooling maintenance records.', '/api/v1/tooling-maintenance'),
    createListToolConfig('get_user_labels', 'Retrieve user labels.', '/api/v1/user-labels'),
    createListToolConfig('get_user_transactions', 'Retrieve user transactions.', '/api/v1/user-transactions'),
    createListToolConfig('get_vendor_returns', 'Retrieve vendor return headers.', '/api/v1/vendor-returns'),
    createListToolConfig('get_vendor_return_line_items', 'Retrieve vendor return line items.', '/api/v1/vendor-returns-line-items'),
    createListToolConfig('get_vendor_return_releases', 'Retrieve vendor return releases.', '/api/v1/vendor-returns-releases'),
    createListToolConfig('get_work_center_maintenance', 'Retrieve work center maintenance records.', '/api/v1/work-center-maintenance'),
    createNoInputGetToolConfig('get_company', 'Retrieve the company profile record.', '/api/v1/company'),
    createListToolConfig('get_contacts', 'Retrieve contacts tied to customers, vendors, or prospects.', '/api/v1/contacts'),
    {
        name: 'create_contact',
        description: 'Create a new contact record. Provide all desired fields defined in the JobBOSS2 API.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) => client.apiCall('POST', '/api/v1/contacts', payload),
    },
    {
        name: 'create_shipping_address',
        description: 'Create a shipping address for a customer.',
        schema: z
            .object({
                customerCode: z.string(),
                location: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ customerCode, location, ...payload }, client) =>
            client.apiCall('POST', '/api/v1/shipping-addresses', {
                customerCode,
                location,
                ...payload,
            }),
    },
    {
        name: 'get_shipping_address_by_id',
        description: 'Retrieve a shipping address by customer code and location.',
        schema: z.object({
            customerCode: z.string(),
            location: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ customerCode, location, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/shipping-addresses/${encodePathSegment(customerCode)}/${encodePathSegment(location)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    {
        name: 'update_shipping_address',
        description: 'Update a shipping address specified by customer code and location.',
        schema: z
            .object({
                customerCode: z.string(),
                location: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ customerCode, location, ...updateData }, client) =>
            client.apiCall(
                'PATCH',
                `/api/v1/shipping-addresses/${encodePathSegment(customerCode)}/${encodePathSegment(location)}`,
                updateData
            ),
        successMessage: ({ location }) => `Shipping address ${location} updated successfully`,
    },
    {
        name: 'get_contact_by_id',
        description: 'Retrieve a contact using its object, contact code, and contact ID.',
        schema: z.object({
            object: z.string(),
            contactCode: z.string(),
            contact: z.string(),
            fields: z.string().optional(),
        }),
        handler: async ({ object, contactCode, contact, fields }, client) =>
            client.apiCall(
                'GET',
                `/api/v1/contacts/${encodePathSegment(object)}/${encodePathSegment(contactCode)}/${encodePathSegment(contact)}`,
                undefined,
                fields ? { fields } : undefined
            ),
    },
    {
        name: 'create_vendor',
        description: 'Create a vendor record.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) => client.apiCall('POST', '/api/v1/vendors', payload),
    },
    {
        name: 'update_vendor',
        description: 'Update a vendor by vendor code.',
        schema: z
            .object({
                vendorCode: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ vendorCode, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/vendors/${encodePathSegment(vendorCode)}`, updateData),
        successMessage: ({ vendorCode }) => `Vendor ${vendorCode} updated successfully`,
    },
    {
        name: 'create_work_center',
        description: 'Create a work center definition.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) => client.apiCall('POST', '/api/v1/work-centers', payload),
    },
    {
        name: 'update_work_center',
        description: 'Update a work center by code.',
        schema: z
            .object({
                workCenter: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ workCenter, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/work-centers/${encodePathSegment(workCenter)}`, updateData),
        successMessage: ({ workCenter }) => `Work center ${workCenter} updated successfully`,
    },
    {
        name: 'update_employee',
        description: 'Update an employee record in JobBOSS2.',
        schema: z
            .object({
                employeeCode: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ employeeCode, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/employees/${encodePathSegment(employeeCode)}`, updateData),
        successMessage: ({ employeeCode }) => `Employee ${employeeCode} updated successfully`,
    },
    {
        name: 'update_salesperson',
        description: 'Update a salesperson record.',
        schema: z
            .object({
                salesID: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ salesID, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/salespersons/${encodePathSegment(salesID)}`, updateData),
        successMessage: ({ salesID }) => `Salesperson ${salesID} updated successfully`,
    },
    {
        name: 'update_purchase_order',
        description: 'Patch an existing purchase order by PO number.',
        schema: z
            .object({
                poNumber: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ poNumber, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/purchase-orders/${encodePathSegment(poNumber)}`, updateData),
        successMessage: ({ poNumber }) => `Purchase order ${poNumber} updated successfully`,
    },
    {
        name: 'update_purchase_order_line_item',
        description: 'Patch a purchase order line item by PO number, part number, and item number.',
        schema: z
            .object({
                purchaseOrderNumber: z.string(),
                partNumber: z.string(),
                itemNumber: z.union([z.string(), z.number()]),
            })
            .catchall(z.any()),
        handler: async ({ purchaseOrderNumber, partNumber, itemNumber, ...updateData }, client) =>
            client.apiCall(
                'PATCH',
                `/api/v1/purchase-order-line-items/${encodePathSegment(purchaseOrderNumber)}/${encodePathSegment(partNumber)}/${encodePathSegment(itemNumber)}`,
                updateData
            ),
        successMessage: ({ purchaseOrderNumber, itemNumber }) =>
            `Purchase order line item ${purchaseOrderNumber}-${itemNumber} updated successfully`,
    },
    {
        name: 'create_time_ticket',
        description: 'Create a time ticket header for an employee/date.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) => client.apiCall('POST', '/api/v1/time-tickets', payload),
    },
    {
        name: 'update_time_ticket',
        description: 'Update a time ticket by ticket date and employee code.',
        schema: z
            .object({
                ticketDate: z.string(),
                employeeCode: z.union([z.string(), z.number()]),
            })
            .catchall(z.any()),
        handler: async ({ ticketDate, employeeCode, ...updateData }, client) =>
            client.apiCall(
                'PATCH',
                `/api/v1/time-tickets/${encodePathSegment(ticketDate)}/employees/${encodePathSegment(employeeCode)}`,
                updateData
            ),
        successMessage: ({ ticketDate, employeeCode }) =>
            `Time ticket ${ticketDate}-${employeeCode} updated successfully`,
    },
    {
        name: 'create_time_ticket_detail',
        description: 'Create a time ticket detail entry (labor transaction).',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) => client.apiCall('POST', '/api/v1/time-ticket-details', payload),
    },
    {
        name: 'update_time_ticket_detail',
        description: 'Update a time ticket detail entry by GUID.',
        schema: z
            .object({
                timeTicketGUID: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ timeTicketGUID, ...updateData }, client) =>
            client.apiCall('PATCH', `/api/v1/time-ticket-details/${encodePathSegment(timeTicketGUID)}`, updateData),
        successMessage: ({ timeTicketGUID }) => `Time ticket detail ${timeTicketGUID} updated successfully`,
    },
    {
        name: 'eci_aps_authenticate_user',
        description: 'Authenticate against the ECI APS endpoints.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) =>
            client.apiCall('POST', '/api/v1/eci-aps/authenticate-user', payload),
    },
    {
        name: 'eci_aps_get_schedule',
        description: 'Retrieve the APS schedule feed.',
        schema: QueryParamsSchema,
        handler: async (params: any, client) => client.apiCall('GET', '/api/v1/eci-aps/get-schedule', undefined, params),
    },
    {
        name: 'shopview_authenticate_user',
        description: 'Authenticate a ShopView user for kiosk dashboards.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) =>
            client.apiCall('POST', '/api/v1/shopview/authenticate-user', payload),
    },
    createListToolConfig('shopview_get_filters', 'Retrieve ShopView filter definitions.', '/api/v1/shopview/filters'),
    createListToolConfig('shopview_get_jobs', 'Retrieve ShopView job data for dashboards.', '/api/v1/shopview/get-jobs'),
    {
        name: 'shopview_set_grid_option',
        description: 'Persist ShopView grid option preferences.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) =>
            client.apiCall('POST', '/api/v1/shopview/grid-option', payload),
    },
    createListToolConfig('shopview_get_grid_options', 'Retrieve saved ShopView grid options.', '/api/v1/shopview/grid-options'),
    createListToolConfig('shopview_kpi_jobs_closed', 'Retrieve ShopView KPI data for jobs closed.', '/api/v1/shopview/kpi/jobs-closed'),
    createListToolConfig(
        'shopview_kpi_jobs_in_progress',
        'Retrieve ShopView KPI data for jobs in progress.',
        '/api/v1/shopview/kpi/jobs-in-progress'
    ),
    createListToolConfig('shopview_kpi_jobs_on_hold', 'Retrieve ShopView KPI data for jobs on hold.', '/api/v1/shopview/kpi/jobs-on-hold'),
    createListToolConfig('shopview_kpi_jobs_past_due', 'Retrieve ShopView KPI data for jobs past due.', '/api/v1/shopview/kpi/jobs-past-due'),
    createListToolConfig('shopview_kpi_definitions', 'Retrieve KPI definitions for ShopView dashboards.', '/api/v1/shopview/kpi-definitions'),
    {
        name: 'shopview_reset_grid_options',
        description: 'Reset ShopView grid options to defaults.',
        schema: AnyObjectSchema,
        handler: async (payload: Record<string, any>, client) =>
            client.apiCall('POST', '/api/v1/shopview/reset-grid-options', payload),
        successMessage: () => 'ShopView grid options reset request submitted',
    },
    {
        name: 'update_contact',
        description: 'Update a contact record by specifying object, contact code, and contact ID.',
        schema: z
            .object({
                object: z.string(),
                contactCode: z.string(),
                contact: z.string(),
            })
            .catchall(z.any()),
        handler: async ({ object, contactCode, contact, ...updateData }, client) =>
            client.apiCall(
                'PATCH',
                `/api/v1/contacts/${encodePathSegment(object)}/${encodePathSegment(contactCode)}/${encodePathSegment(contact)}`,
                updateData
            ),
        successMessage: ({ contact }) => `Contact ${contact} updated successfully`,
    },
];
