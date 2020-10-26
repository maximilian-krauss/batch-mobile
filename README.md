# batch-mobile 🦇

![Batch Cave](https://github.com/maximilian-krauss/batch-mobile/workflows/Batch%20Cave/badge.svg?branch=master) [![npm version](https://badge.fury.io/js/batch-mobile.svg)](https://badge.fury.io/js/batch-mobile) ![vulnerabilities](https://snyk.io/test/github/maximilian-krauss/batch-mobile/badge.svg?targetFile=package.json)

Asynchronous batched iterable for (mongo) cursors

A library when one is not enough and all is to much.

## Installation

`npm i batch-mobile`

## API

### getBatchedIterableFromCursor(`cursor`, `batchSize`)

* `cursor`: Any iterable cursor which exposes an asynchronous next method 
(best practice with mongo is to create the cursor with the "batchSize" option to
match the value passed in "batchSize" argument for optimal memory usage)
* `batchSize`: The size of the yielded batch. Defaults to 200 if unset.

## Usage

### Simple example

```js
async function example() {
    const { getBatchedIterableFromCursor } = require('batch-mobile')
    for await (const batchOfItems of getBatchedIterableFromCursor(cursor)) {
      await pushBatchToService(batchOfItems)
    }
}();
```

### Mongo example

```js
const { MongoClient } = require('mongodb')
const client = await (new MongoClient(process.env.MONGO_URI)).connect()
const { getBatchedIterableFromCursor } = require('batch-mobile')

const BATCH_SIZE = 1000;
async function example() {
  try {
    const collection = client.db('application').collection('collection')
    // By using the batch size option we make sure mongo driver pulls
    // exactly the amount of documents into the process memory as we handle them.
    // This will cause optimal memory usage and prevent unnecessary round trips to the mongo
    // server
    const options = {cursor: {batchSize: BATCH_SIZE}}
    const cursor = collection
      .find({ foo: 'bar' }, options)
  
    for await (const batch of getBatchedIterableFromCursor(cursor, BATCH_SIZE)) {
      await processItemsFrom(batch)
    }
  } finally {
    await client.close(true)
  }
}();
```
