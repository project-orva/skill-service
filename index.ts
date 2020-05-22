import grpc from 'grpc';

import GenerateRPC, { Rpc, RpcConfig } from './lib/utils/generate-rpc';
import DetermineSkill from './lib/rpcs/determine-skill';

import RegisterCurrentInstance, {
    RegisterRequest,
    RegisterResponse,
} from './lib/rpcs/register-current-instance';
import RpcHandler from './lib/utils/rpc-handler';

const PROTO_PATH = __dirname + '/api/service.proto';

const rpc: Rpc = GenerateRPC({
    protoPath: PROTO_PATH,
} as RpcConfig);

function getServer() {
    const server = new grpc.Server();
    server.addService(rpc.serviceGuide.service, {
        determineSkillFromMessage: RpcHandler(DetermineSkill),
        registerCurrentInstance:
            RpcHandler<RegisterRequest, RegisterResponse>(
                RegisterCurrentInstance),
    });

    return server;
}

const routeServer = getServer();
routeServer.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
routeServer.start();