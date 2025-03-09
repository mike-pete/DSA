export class Heap<T> {
	private heap: (T | undefined)[] = [undefined]
	private prioritize: (a: T, b: T) => number

	constructor(prioritize: (a: T, b: T) => number, toHeapify: T[] = []) {
		this.prioritize = prioritize
		this.heap = [undefined, ...toHeapify]
		this.heapify()
	}

	private float(index: number) {
		while (this.prioritize(this.heap[index] as T, this.heap[Math.floor(index / 2) || 1] as T) < 0) {
			const tmp = this.heap[index]
			this.heap[index] = this.heap[Math.floor(index / 2) || 1]
			this.heap[Math.floor(index / 2) || 1] = tmp
			index = Math.floor(index / 2) || 1
		}
	}

	private sink(index: number) {
		while (
			(this.heap?.[index * 2] !== undefined &&
				this.prioritize(this.heap[index * 2] as T, this.heap[index] as T) < 0) ||
			(this.heap?.[index * 2 + 1] !== undefined &&
				this.prioritize(this.heap[index * 2 + 1] as T, this.heap[index] as T) < 0)
		) {
			const tmp = this.heap[index]

			const rightIsMin =
				this.heap?.[index * 2 + 1] !== undefined &&
				this.prioritize(this.heap[index * 2 + 1] as T, this.heap[index * 2] as T) < 0

			if (rightIsMin) {
				this.heap[index] = this.heap[index * 2 + 1]
				this.heap[index * 2 + 1] = tmp
				index = index * 2 + 1
			} else {
				this.heap[index] = this.heap[index * 2]
				this.heap[index * 2] = tmp
				index = index * 2
			}
		}
	}

	heapify() {
		const middleIndex = Math.floor((this.heap.length - 1) / 2)
		for (let i = middleIndex; i > 0; i--) {
			this.sink(i)
		}
	}

	push(val: T) {
		this.heap.push(val)
		this.float(this.heap.length - 1)
	}

	pop(): T | undefined {
		if (this.heap.length === 2) {
			return this.heap.pop()
		}
		if (this.heap.length === 1) {
			return undefined
		}
		const toReturn = this.heap?.[1]
		this.heap[1] = this.heap.pop()
		this.sink(1)
		return toReturn
	}

	get top() {
		return this.heap?.[1]
	}
}
