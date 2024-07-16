export class ResponseData<T = any> {

  success: boolean = false;
  errorCode: number = -1

  data!: T;

}
