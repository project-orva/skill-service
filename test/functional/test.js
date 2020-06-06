const grpc = require('grpc');
const protoloader = require('@grpc/proto-loader');

const createClient = (protoPath, serviceURL, name) => {
  const protoDescriptor = grpc.loadPackageDefinition(protoloader.loadSync(
    protoPath,
    {
      keepCase: true,
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
  client['ProcessSkillRequest']({
    Message: message,
    TransactionID: 'text123'
  },
    (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
});

const main = async () => {
  const startTime = Date.now() / 1000;

  const client = createClient("../../api/service.proto", "localhost:50051", 'grpcSkill');

  const response = await request(client, "dis test service ");
  console.log("response:", response);
  console.log(`time ${((Date.now() / 1000) - startTime) * 1000}ms`)
}

main();
