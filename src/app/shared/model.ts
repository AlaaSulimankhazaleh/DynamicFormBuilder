export interface IResponseResult<T> {
  errors: string[]; // Array of strings representing the errors
  status: ResultStatus; // Assuming ResultStatus is an enum or type that you have defined elsewhere
  data: T; // Generic type for the data
  totalRecords: number; // Total number of records
}
export enum ResultStatus
    {
        Failed = 0,
        Success = 1,
        SuccessWithRedirect = 2,
        SuccessWithWarning = 3,
    }

    export interface RegisterRequestModel {
      email: string;
      password: string;
      confirmPassword: string;
      createdBy: string;
  }
  export interface RegisterResponseModel {
    id: number;
    email: string;
}

export interface SignInResponseModel{
  id: number;
  email: string;
  createdBy:string;
  token: string;
}
export interface SignInRequestModel {
  email: string;
  password: string;
}
