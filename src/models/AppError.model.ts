export default class AppError {
  code: number = -1
  message: string|undefined = ''

  constructor(code: number, message: string|undefined) {
    this.code = code;
    this.message = message;
  }
}