### Skill Service
Skill service handles the routing and determination of skills that are registered to this system.

At a high level the deterministic evaluation works by extracting all of the features present within 
provided example statements and compares them with the features present within the input. 

We are using gRPC for both registering skills to the service and making predictions on input.

## Road map
- Support for batch predictions; preprocessing for context. 
- Setup ci pipeline + Docker
- Integrate into existing SDK 