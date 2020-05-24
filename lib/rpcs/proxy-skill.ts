import determineSkill from '../determine-skill';

export interface ProcessRequest {
    Message: string,
    TransactionID: string,
}

export interface ProcessResponse {
    ForwardAddress: string,
    SubsetID: string,
}

const BOUNDARY = 0.56; // @@ move me

export default async (request: ProcessRequest): Promise<ProcessResponse> => {
    const prediction = await determineSkill({
        message: request.Message,
    });
    if (prediction.accuracy >= BOUNDARY) {
        return {
            ForwardAddress: prediction.forwardAddress,
            SubsetID: prediction.subsetID,
        } as ProcessResponse;
    }

    return {} as ProcessResponse;
}