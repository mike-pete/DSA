import { describe, expect, test } from 'bun:test'
import Heap from './Heap'

describe('Heap', () => {
	// Helper function to create a min heap
	const createMinHeap = (initial: number[] = []) => {
		return new Heap<number>((a: number, b: number) => a - b, initial)
	}

	// Helper function to create a max heap
	const createMaxHeap = (initial: number[] = []) => {
		return new Heap<number>((a: number, b: number) => b - a, initial)
	}

	test('should create an empty heap', () => {
		const heap = createMinHeap()
		expect(heap.top).toBeUndefined()
	})

	test('should create a heap with initial values', () => {
		const heap = createMinHeap([3, 1, 4, 1, 5])
		expect(heap.top).toBe(1)
	})

	test('should maintain min heap property', () => {
		const heap = createMinHeap()
		heap.push(3)
		heap.push(1)
		heap.push(4)
		expect(heap.top).toBe(1)

		heap.push(0)
		expect(heap.top).toBe(0)
	})

	test('should maintain max heap property', () => {
		const heap = createMaxHeap()
		heap.push(3)
		heap.push(1)
		heap.push(4)
		expect(heap.top).toBe(4)

		heap.push(5)
		expect(heap.top).toBe(5)
	})

	test('should pop values in correct order for min heap', () => {
		const heap = createMinHeap([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5])
		const result = []
		while (heap.top !== undefined) {
			result.push(heap.pop())
		}
		expect(result).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9])
	})

	test('should pop values in correct order for max heap', () => {
		const heap = createMaxHeap([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5])
		const result = []
		while (heap.top !== undefined) {
			result.push(heap.pop())
		}
		expect(result).toEqual([9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1])
	})

	test('should handle custom objects', () => {
		type Task = { priority: number; name: string }
		const heap = new Heap<Task>((a, b) => a.priority - b.priority)

		heap.push({ priority: 3, name: 'Medium' })
		heap.push({ priority: 1, name: 'Urgent' })
		heap.push({ priority: 5, name: 'Low' })

		expect(heap.top?.name).toBe('Urgent')
		expect(heap.pop()?.name).toBe('Urgent')
		expect(heap.top?.name).toBe('Medium')
	})

	test('should handle edge cases', () => {
		const heap = createMinHeap()

		// Empty heap operations
		expect(heap.pop()).toBeUndefined()
		expect(heap.top).toBeUndefined()

		// Single element
		heap.push(1)
		expect(heap.top).toBe(1)
		expect(heap.pop()).toBe(1)
		expect(heap.top).toBeUndefined()

		// Push after empty
		heap.push(2)
		expect(heap.top).toBe(2)
	})

	test('should handle duplicate values', () => {
		const heap = createMinHeap()
		heap.push(1)
		heap.push(1)
		heap.push(1)

		expect(heap.pop()).toBe(1)
		expect(heap.pop()).toBe(1)
		expect(heap.pop()).toBe(1)
		expect(heap.pop()).toBeUndefined()
	})

	test('should heapify correctly', () => {
		const heap = createMinHeap([5, 4, 3, 2, 1])
		expect(heap.top).toBe(1)

		const values = []
		while (heap.top !== undefined) {
			values.push(heap.pop())
		}
		expect(values).toEqual([1, 2, 3, 4, 5])
	})
})
