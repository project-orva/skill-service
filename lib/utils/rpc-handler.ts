export type Handler<T, R> = (request: T) => Promise<R>;

export default <T, R>(handler: Handler<T, R>) => async (
    call: any, cb: any,
): Promise<R> => cb(null, handler(call.request))