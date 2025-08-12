interface ResponseType<T> {
  data: T;
  message: string;
  status: number;
}

export default ResponseType;
