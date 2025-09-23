interface PaginationType<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  links: [];
  per_page: number;
}
export default PaginationType;
