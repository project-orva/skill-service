export type Handler = <T, R>(request: T) => Promise<R>;

export default (handler: Handler) => async (
    call: any, cb: any,
): Promise<void> => cb(null, handler(call.request))