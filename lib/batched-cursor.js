const { ok } = require('assert')

const getBatchedIterableFromCursor = async function * (cursor, batchSize = 200) {
  ok(!!cursor, 'Invalid argument: cursor needs to be defined')
  ok(batchSize > 0, 'Invalid argument: batchSize needs to be defined and greater than zero')

  let batch = []

  let hasNext = false
  do {
    const document = await cursor.next()
    hasNext = !!document
    if (hasNext) batch.push(document)

    if (batch.length > 0 && (batch.length === batchSize || !hasNext)) {
      yield batch
      batch = []
    }
  } while (hasNext)
}

module.exports = {
  getBatchedIterableFromCursor
}
