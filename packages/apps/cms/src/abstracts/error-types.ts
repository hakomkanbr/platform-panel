export interface IError {
    title: string,
    description: string,
    coder: string,
    key: EnumErrorType
}

export enum EnumErrorType
{
    Error = 0,
    Info = 1,
    Warning = 1
}


export const mWebsiteRequired : IError = {
      title: "Website Selection Required",
      description: "Website Selection Required",
      key: EnumErrorType.Error,
      coder: "mWebsiteRequired"
};