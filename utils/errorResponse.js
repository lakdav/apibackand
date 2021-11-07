class ErrorResponse extends Error {
  constructor(massage, statuseCode) {
    super(massage);
    this.statuseCode = statuseCode;
  }
}
export default ErrorResponse;
