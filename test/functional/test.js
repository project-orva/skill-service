const grpc = require('grpc');
const protoloader = require('@grpc/proto-loader');

const createClient = (protoPath, serviceURL, name) => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
      protoPath,
      {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
  ));

  const GrpcInstance = protoDescriptor[name][name];

  return new GrpcInstance(
      serviceURL,
      grpc.credentials.createInsecure()
  );
};

const request = async (client, message) => await new Promise((resolve, reject) => {
    client['ProxySkillRequest']({
      Message: message,
      TransactionID: 'text123'
    },
    (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

const main = async () => {
    const client = createClient("../../api/service.proto", "localhost:50051", 'grpcSkill');

    const response = await request(client, "turn on the lights");
    console.log(response);
}

main();
