/// <reference types="jest" />
const { getBatchedIterableFromCursor } = require('..')

const fakedCursor = { next: jest.fn() }

describe('batched-mongo-cursor', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('.getBatchedIterableFromCursor()', () => {
    it('should throw if no cursor has been passed', async () => {
      expect.assertions(1)
      try {
        await getBatchedIterableFromCursor().next()
      } catch (error) {
        expect(error.message).toMatch('Invalid argument: cursor needs to be defined')
      }
    })

    it('should throw if invalid batchSize has been provided (null)', async () => {
      expect.assertions(1)
      try {
        await getBatchedIterableFromCursor(fakedCursor, null).next()
      } catch (error) {
        expect(error.message).toMatch('Invalid argument: batchSize needs to be defined and greater than zero')
      }
    })

    it('should throw if invalid batchSize has been provided (0)', async () => {
      expect.assertions(1)
      try {
        await getBatchedIterableFromCursor(fakedCursor, 0).next()
      } catch (error) {
        expect(error.message).toMatch('Invalid argument: batchSize needs to be defined and greater than zero')
      }
    })

    it('should throw if invalid batchSize has been provided (-1)', async () => {
      expect.assertions(1)
      try {
        await getBatchedIterableFromCursor(fakedCursor, -1).next()
      } catch (error) {
        expect(error.message).toMatch('Invalid argument: batchSize needs to be defined and greater than zero')
      }
    })

    it('should throw if cursor throws 🤮', async () => {
      expect.assertions(3)
      let results = []
      let calls = 0
      try {
        fakedCursor.next
          .mockResolvedValueOnce(1)
          .mockRejectedValue(new Error('cursor died'))

        for await (const batch of getBatchedIterableFromCursor(fakedCursor, 1)) {
          results = [...results, ...batch]
          calls++
        }
      } catch (error) {
        expect(error.message).toMatch('cursor died')
      }
      expect(results).toEqual([1])
      expect(calls).toEqual(1)
    })

    it('should return 3 batches', async () => {
      fakedCursor.next
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(5)
        .mockResolvedValue(null)

      let results = []
      let calls = 0

      for await (const batch of getBatchedIterableFromCursor(fakedCursor, 2)) {
        results = [...results, ...batch]
        calls++
      }

      expect(calls).toEqual(3)
      expect(results).toEqual([1, 2, 3, 4, 5])
    })

    it('should do nothing of cursor has no results', async () => {
      fakedCursor.next
        .mockResolvedValue(null)

      let results = []
      let calls = 0

      for await (const batch of getBatchedIterableFromCursor(fakedCursor, 2)) {
        console.log(batch)
        results = [...results, ...batch]
        calls++
      }

      expect(calls).toEqual(0)
      expect(results).toEqual([])
    })
  })
})
