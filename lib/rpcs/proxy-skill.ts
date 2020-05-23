import determineSkill from '../determine-skill';
import { createClient } from '../utils/generate-rpc';

const client = createClient({
    protoPath: '../../api/skill.proto',
}, 'grpcSKillSession');

export interface ProxyRequest {
    Message: string,
    TransactionID: string,
}

export interface ProxyResponse {
    Statement: string,
    AssignedFrom: string,
    GraphicURL: string,
    GraphicType: number,
    Error: string,
}

const BOUNDARY = 0.4; // @@ move me

export default async (request: ProxyRequest): Promise<ProxyResponse> => {
    const prediction = await determineSkill({
        message: request.Message,
    });

    if (prediction.accuracy >= BOUNDARY) {
        return client(prediction.forwardAddress).HandleSession({
            TransactionID: request.TransactionID,
            SubsetID: prediction.subsetID,
        });
    }

    return {} as ProxyResponse;
}