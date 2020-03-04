# batch-mobile 🦇

![Batch Cave](https://github.com/maximilian-krauss/batch-mobile/workflows/Batch%20Cave/badge.svg?branch=master) [![npm version](https://badge.fury.io/js/batch-mobile.svg)](https://badge.fury.io/js/batch-mobile) ![vulnerabilities](https://snyk.io/test/github/maximilian-krauss/batch-mobile/badge.svg?targetFile=package.json)

Asynchronous batched iterable for (mongo) cursors

A library when one is not enough and all is to much.

## Installation

`npm i batch-mobile`

## API

### getBatchedIterableFromCursor(`cursor`, `batchSize`)

* `cursor`: Any iterable cursor which exposes an aynchronous next method
* `batchSize`: The size of the yielded batch. Defaults to 200 if unset.

## Usage

### Simple example

```js
const { getBatchedIterableFromCursor } = require('batch-mobile')
for await (const batchOfItems of getBatchedIterableFromCursor(cursor)) {
  await pushBatchToService(batchOfItems)
}
```

### Mongo example

```js
const { MongoClient } = require('mongodb')
const client = await (new MongoClient(process.env.MONGO_URI)).connect()
const { getBatchedIterableFromCursor } = require('batch-mobile')

try {
  const collection = client.db('application').collection('collection')
  const cursor = collection
    .find({ foo: 'bar' })

  for await (const batch of getBatchedIterableFromCursor(cursor, 1000)) {
    await processItemsFrom(batch)
  }
} finally {
  await client.close(true)
}
```
