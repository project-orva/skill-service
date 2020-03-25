import grpc

import futures 

import service_pb2
import service_pb2_grpc

class SkillServicer(service_pb2_grpc.grpcSkillServicer):
    def DetermineSkillFromMessage(self, request, context):
        print(request)
        return service_pb2.SkillDeterminationResponse()

    def RegisterCurrentInstance(self, request, context):
        print(request)
        return service_pb2

def run():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_grpcSkillServicer_to_server(
        SkillServicer(), server
    )
    server.add_insecure_port('[::]:5355')
    server.start()
    print("server started on ported 5355")
    server.wait_for_termination()
 
if __name__ == "__main__":
    run()    