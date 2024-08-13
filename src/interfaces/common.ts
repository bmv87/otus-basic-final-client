
export interface Pagination<T> {
  totalCount: number,
  items: T[]
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string | null
  sortDir?: string | null
}
