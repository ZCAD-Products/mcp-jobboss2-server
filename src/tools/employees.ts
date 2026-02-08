import { JobBOSS2Client } from '../jobboss2-client.js';
import { ToolDefinition } from './tool-definition.js';
import {
    GetEmployeesSchema,
    GetEmployeeByIdSchema,
    GetAttendanceTicketsSchema,
    GetAttendanceTicketByIdSchema,
    CreateAttendanceTicketSchema,
    GetAttendanceTicketDetailsSchema,
    CreateAttendanceTicketDetailSchema,
    UpdateAttendanceTicketDetailSchema,
    GetAttendanceReportSchema,
    GetTimeTicketDetailByIdSchema,
    GetTimeTicketByIdSchema,
    QueryParamsSchema,
} from '../schemas.js';

export const employeeTools: ToolDefinition[] = [
    {
        name: 'get_employees',
        description: 'Retrieve a list of employees from JobBOSS2. Supports filtering, sorting, pagination, and field selection.',
    },
    {
        name: 'get_employee_by_id',
        description: 'Retrieve a specific employee by their employee ID.',
    },
    {
        name: 'get_attendance_tickets',
        description: 'Retrieve a list of attendance tickets from JobBOSS2. Supports filtering by employee, date range, and other fields.',
    },
    {
        name: 'get_attendance_ticket_by_id',
        description: 'Retrieve a specific attendance ticket by ticket date and employee code.',
    },
    {
        name: 'create_attendance_ticket',
        description: 'Create a new attendance ticket in JobBOSS2.',
    },
    {
        name: 'get_attendance_ticket_details',
        description: 'Retrieve a list of attendance ticket details (clock in/out times) from JobBOSS2. Supports filtering by employee, date, and other criteria.',
    },
    {
        name: 'create_attendance_ticket_detail',
        description: 'Create a new attendance ticket detail (clock in/out entry) for a specific ticket.',
    },
    {
        name: 'update_attendance_ticket_detail',
        description: 'Update an existing attendance ticket detail (clock in/out times).',
    },
    {
        name: 'get_attendance_report',
        description: 'Generate a comprehensive attendance report for a date range. This report includes ALL attendance types: regular work time, sick time, vacation, and other leave. Perfect for weekly/daily attendance reports that need to show both worked hours and absences.',
    },
    {
        name: 'get_salespersons',
        description: 'Retrieve salesperson master records including commission settings and contact info.',
    },
    {
        name: 'get_time_ticket_details',
        description: 'Retrieve shop floor time ticket detail entries (clocked labor) across jobs, work centers, or employees.',
    },
    {
        name: 'get_time_ticket_detail_by_id',
        description: 'Retrieve a single time ticket detail by its GUID.',
    },
    {
        name: 'get_time_tickets',
        description: 'Retrieve time ticket headers (per employee per day).',
    },
    {
        name: 'get_time_ticket_by_id',
        description: 'Retrieve a specific time ticket header by ticket date and employee code.',
    },
];

export const employeeHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    get_employees: async (args, client) => {
        const params = GetEmployeesSchema.parse(args);
        return client.getEmployees(params);
    },
    get_employee_by_id: async (args, client) => {
        const { employeeID, fields } = GetEmployeeByIdSchema.parse(args);
        return client.getEmployeeById(employeeID, { fields });
    },
    get_attendance_tickets: async (args, client) => {
        const params = GetAttendanceTicketsSchema.parse(args);
        return client.getAttendanceTickets(params);
    },
    get_attendance_ticket_by_id: async (args, client) => {
        const { ticketDate, employeeCode, fields } = GetAttendanceTicketByIdSchema.parse(args);
        return client.getAttendanceTicketById(ticketDate, employeeCode, { fields });
    },
    create_attendance_ticket: async (args, client) => {
        const ticketData = CreateAttendanceTicketSchema.parse(args);
        return client.createAttendanceTicket(ticketData);
    },
    get_attendance_ticket_details: async (args, client) => {
        const params = GetAttendanceTicketDetailsSchema.parse(args);
        return client.getAttendanceTicketDetails(params);
    },
    create_attendance_ticket_detail: async (args, client) => {
        const { ticketDate, employeeCode, ...detailData } = CreateAttendanceTicketDetailSchema.parse(args);
        return client.createAttendanceTicketDetail(ticketDate, employeeCode, detailData);
    },
    update_attendance_ticket_detail: async (args, client) => {
        const { id, ...detailData } = UpdateAttendanceTicketDetailSchema.parse(args);
        await client.updateAttendanceTicketDetail(id, detailData);
        return { success: true };
    },
    get_attendance_report: async (args, client) => {
        const { startDate, endDate, employeeCodes } = GetAttendanceReportSchema.parse(args);
        return client.getAttendanceReport(startDate, endDate, employeeCodes);
    },
    get_salespersons: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getSalespersons(params);
    },
    get_time_ticket_details: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getTimeTicketDetails(params);
    },
    get_time_ticket_detail_by_id: async (args, client) => {
        const { timeTicketGUID, fields } = GetTimeTicketDetailByIdSchema.parse(args);
        return client.getTimeTicketDetailByGuid(timeTicketGUID, { fields });
    },
    get_time_tickets: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getTimeTickets(params);
    },
    get_time_ticket_by_id: async (args, client) => {
        const { ticketDate, employeeCode, fields } = GetTimeTicketByIdSchema.parse(args);
        return client.getTimeTicketById(ticketDate, employeeCode, { fields });
    },
};
