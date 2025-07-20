export function responseMessage <T>(message?:string,data?: T){
    return {
        success:true,
        ...(message? {message}: {}),
        data
    }
}