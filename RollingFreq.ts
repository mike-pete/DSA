class RollingFreq {
	readonly #original: Record<string, number> = {}
	remaining: Set<string>
	freq: Record<string, number>
	queue: string[]

	constructor(itemsNeeded: Record<string, number>) {
		for (const [item, count] of Object.entries(itemsNeeded)) {
			if (count < 0) {
				throw new Error('Invalid "itemsNeeded" value. Negative numbers are not allowed.')
			} else if (count > 0) {
				this.#original[item] = count
			}
		}
		this.reset()
	}

	reset() {
		this.remaining = new Set<string>(Object.keys(this.#original))
		this.freq = this.#original
		this.queue = []
	}

	add(item: string) {
		this.queue.push(item)
		this.freq[item] ??= 0
		this.freq[item] -= 1

		if (this.freq[item] < 0) {
			let removed = this.removeFromQueue()
			while (removed !== item) {
				removed = this.removeFromQueue()
			}
		}

		if (this.freq[item] === 0) {
			this.remaining.delete(item)
		}
	}

	private removeFromQueue() {
		const item = this.queue.shift()

		if (item === undefined) {
			throw new Error('Unexpected error!')
		}

		this.freq[item] ??= 0
		this.freq[item] += 1
		this.remaining.add(item)
		return item
	}

	get hasDesiredFreq() {
		return this.remaining.size === 0
	}
}

let x = new RollingFreq({ a: 0, b: 2 })
console.log(x.hasDesiredFreq, x.queue, x.remaining)

x.add('b')
x.add('b')
console.log(x.hasDesiredFreq, x.queue, x.remaining)

x.add('a')
console.log(x.hasDesiredFreq, x.queue, x.remaining)

x.add('a')
console.log(x.hasDesiredFreq, x.queue, x.remaining)
x.add('b')
console.log(x.hasDesiredFreq, x.queue, x.remaining)
x.add('b')
x.add('a')
console.log(x.hasDesiredFreq, x.queue, x.remaining)
