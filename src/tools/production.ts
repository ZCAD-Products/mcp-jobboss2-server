import { JobBOSS2Client } from '../jobboss2-client.js';
import { ToolDefinition } from './tool-definition.js';
import {
    GetEstimatesSchema,
    GetEstimateByPartNumberSchema,
    CreateEstimateSchema,
    UpdateEstimateSchema,
    GetRoutingByPartSchema,
    GetWorkCenterByCodeSchema,
    GetEstimateMaterialBySubPartSchema,
    QueryParamsSchema,
} from '../schemas.js';

export const productionTools: ToolDefinition[] = [
    {
        name: 'get_estimates',
        description: 'Retrieve a list of estimates (part master records) from JobBOSS2. Supports filtering, sorting, pagination, and field selection.',
    },
    {
        name: 'get_estimate_by_part_number',
        description: 'Retrieve a specific estimate (part master record) by its part number.',
    },
    {
        name: 'create_estimate',
        description: 'Create a new estimate (part master record) in JobBOSS2. This creates a new part number with pricing, costing, and bill of materials information.',
    },
    {
        name: 'update_estimate',
        description: 'Update an existing estimate (part master record) in JobBOSS2.',
    },
    {
        name: 'get_routings',
        description: 'Retrieve routings (work center steps) independent of orders, filtered by part number, work center, etc.',
    },
    {
        name: 'get_routing_by_part_number',
        description: 'Retrieve a specific routing tied to an estimate part number and step number.',
    },
    {
        name: 'get_work_centers',
        description: 'Retrieve work center definitions including labor/burden rates and capacity factors.',
    },
    {
        name: 'get_work_center_by_code',
        description: 'Retrieve a specific work center by its code.',
    },
    {
        name: 'get_estimate_material_by_sub_part',
        description: 'Retrieve a specific material of an estimate by the parent part number and sub-part (material) number. Useful for checking bill of materials details.',
    },
];

export const productionHandlers: Record<string, (args: any, client: JobBOSS2Client) => Promise<any>> = {
    get_estimates: async (args, client) => {
        const params = GetEstimatesSchema.parse(args);
        return client.getEstimates(params);
    },
    get_estimate_by_part_number: async (args, client) => {
        const { partNumber, fields } = GetEstimateByPartNumberSchema.parse(args);
        return client.getEstimateByPartNumber(partNumber, { fields });
    },
    create_estimate: async (args, client) => {
        const estimateData = CreateEstimateSchema.parse(args);
        return client.createEstimate(estimateData);
    },
    update_estimate: async (args, client) => {
        const { partNumber, ...updateData } = UpdateEstimateSchema.parse(args);
        await client.updateEstimate(partNumber, updateData);
        return { success: true }; // updateEstimate returns void
    },
    get_routings: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getRoutings(params);
    },
    get_routing_by_part_number: async (args, client) => {
        const { partNumber, stepNumber, fields } = GetRoutingByPartSchema.parse(args);
        return client.getRoutingByPartNumber(partNumber, stepNumber, { fields });
    },
    get_work_centers: async (args, client) => {
        const params = QueryParamsSchema.parse(args);
        return client.getWorkCenters(params);
    },
    get_work_center_by_code: async (args, client) => {
        const { workCenter, fields } = GetWorkCenterByCodeSchema.parse(args);
        return client.getWorkCenterByCode(workCenter, { fields });
    },
    get_estimate_material_by_sub_part: async (args, client) => {
        const { partNumber, subPartNumber, fields } = GetEstimateMaterialBySubPartSchema.parse(args);
        return client.apiCall(
            'GET',
            `/api/v1/estimates/${encodeURIComponent(partNumber)}/materials/${encodeURIComponent(subPartNumber)}`,
            undefined,
            fields ? { fields } : undefined
        );
    },
};
