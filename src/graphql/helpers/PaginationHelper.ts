import _ from 'lodash'

type PaginationKey = | 'from' | 'size';
type PartialList = Partial<Record<PaginationKey, number>>;
type Pagination = { from: number, size: number };

export class PaginationHelper {
  static initPagination<T extends PartialList>(arg?: T): Pagination & T {
    let size = arg?.size;
    let from = arg?.from;
    const MAX_SIZE = 50

    if (_.isNil(size)) size = 5;
    else if (size < 0) size = 5;
    else if (size > MAX_SIZE) size = MAX_SIZE;

    if (_.isNil(from)) from = 0;
    else if (from < 0) from = 0;
    return { ...arg, size, from } as Pagination & T;
  }
}



