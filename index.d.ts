export type Cursor = {
  next: Promise<any>
}

export default class BatchMobile {
  static getBatchedIterableFromCursor(cursor: Cursor, batchSize: number)
    : AsyncGenerator<any[], void, unknown>;
}