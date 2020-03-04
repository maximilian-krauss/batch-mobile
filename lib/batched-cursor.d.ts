export type Cursor = {
  next: Promise<any>
}

export default class BatchedCursor {
  static getBatchedIterableFromCursor(cursor: Cursor, batchSize: number)
    : AsyncGenerator<any[], void, unknown>;
}
