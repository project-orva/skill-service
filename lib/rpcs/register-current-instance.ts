export default (call: any, callback: any): void => {
    console.log('register current called!')

    call.end();
}