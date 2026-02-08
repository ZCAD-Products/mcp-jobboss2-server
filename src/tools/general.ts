import { JobBOSS2Client } from '../jobboss2-client.js';
import { ToolDefinition } from './tool-definition.js';
import {
    CustomApiCallSchema,
    RunReportSchema,
    GetReportStatusSchema,
    QueryParamsSchema,
} from '../schemas.js';

export const generalTools: ToolDefinition[] = [
    {
        name: 'custom_api_call',
        description: 'Make a custom API call to any JobBOSS2 API endpoint. Use this for endpoints not covered by other tools. Endpoint will automatically be prefixed with /api/v1/ if not present.',
    },
    {
        name: 'run_report',
        description: 'Submit a JobBOSS2 report request. Pass the exact payload expected by /api/v1/reports (reportName, parameters, output format, etc.). Returns a requestId for polling.',
    },
    {
        name: 'get_report_status',
        description: 'Fetch the status/result of a previously submitted report using the requestId returned by run_report.',
    },
    {
        name: 'get_document_controls',
        description: 'Retrieve document control headers including approval state, revision history, release information, and repository data. Supports filters, field selection, and pagination.',
    },
    {
        name: 'get_document_histories',
        description: 'Retrieve document history entries that show revision notes, users, and affected jobs/parts.',
    },
    {
        name: 'get_document_reviews',
        description: 'Retrieve document review assignments, including vendor/employee reviewers, start/end dates, and completion status.',
    },
];

export const generalHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    custom_api_call: async (args, client) => {
        const { method, endpoint, data, params } = CustomApiCallSchema.parse(args);
        return client.apiCall(method, endpoint, data, params);
    },
    run_report: async (args, client) => {
        const { body } = RunReportSchema.parse(args);
        return client.submitReportRequest(body);
    },
    get_report_status: async (args, client) => {
        const { requestId } = GetReportStatusSchema.parse(args);
        return client.getReportRequest(requestId);
    },
    get_document_controls: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getDocumentControls(params);
    },
    get_document_histories: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getDocumentHistories(params);
    },
    get_document_reviews: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getDocumentReviews(params);
    },
};
