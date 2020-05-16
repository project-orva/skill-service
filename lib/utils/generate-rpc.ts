const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

export interface Rpc {
    serviceGuide: any,
    instance: any
}

export interface RpcConfig {
    protoPath: string
}

export default ({ protoPath }: RpcConfig): Rpc => {
    const packageDefinition = protoLoader.loadSync(
        protoPath,
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const serviceGuide = protoDescriptor.grpcSkill.grpcSkill;

    return {
        instance: new grpc.Server(),
        serviceGuide,
    };
}
