import _ from 'lodash'

type PaginationKey =
    | 'from'
    | 'size';
type PartialList = Partial<Record<PaginationKey , number>>;

type Pagination = {
  from: number
  size: number
}
const MAX_SIZE = 50

export function initPagination<T extends PartialList>(arg?: T): Pagination & T {
  let size = arg?.size;
  let from = arg?.from;

  switch (true) {
    case _.isNil(size): {
      size = 5;
      break;
    }
    case size < 0: {
      size = 5;
      break;
    }
    case size > MAX_SIZE: {
      size = MAX_SIZE;
      break;
    }
  }

  switch (true) {
    case _.isNil(from): {
      from = 0;
      break;
    }
    case from < 0: {
      from = 0;
      break;
    }
  }

  return { ...arg, size, from } as Pagination & T;
}
