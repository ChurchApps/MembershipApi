import _ from 'lodash'

type PaginationKey =
    | 'from'
    | 'size';
type PartialList = Partial<Record<PaginationKey , number>>;

type Pagination = {
  from: number
  size: number
}

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
    case size > 25: {
      size = 25;
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
