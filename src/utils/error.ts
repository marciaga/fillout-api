// public turns the constructor param into a class property with the same name
export class StatusError extends Error {
  constructor(
    public statusCode: number,
    message?: string,
  ) {
    super(message);
  }
}
