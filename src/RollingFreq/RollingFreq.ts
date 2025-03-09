/**
 * RollingFreq is a data structure that tracks frequencies of items in a rolling window,
 * comparing them against desired frequencies.
 *
 * @example
 * ```typescript
 * const x = new RollingFreq({ a: 2, b: 1 });
 * x.add('a');
 * console.log(x.isDesiredGroup); // false
 * x.add('a');
 * x.add('b');
 * console.log(x.isDesiredGroup); // true
 * ```
 */
export default class RollingFreq {
	private readonly original: Record<string, number> = {}
	private remaining: Set<string> = new Set()
	private freq: Record<string, number> = {}
	private queue: string[] = []

	/**
	 * Creates a new RollingFreq instance
	 * @param needed - Record of items and their required frequencies
	 * @throws {Error} If needed is empty or contains invalid frequencies
	 */
	constructor(needed: Record<string, number>) {
		if (Object.keys(needed).length === 0){
			throw new Error('Frequency requirements cannot be empty')
		}
		for (const [item, count] of Object.entries(needed)) {
			if (count < 0 || !Number.isInteger(count)) {
				throw new Error('Invalid value for desired frequency.')
			} else if (count > 0) {
				this.original[item] = count
			}
		}
		this.reset()
	}

	/**
	 * Resets the counter to its initial state
	 */
	public reset(): void {
		this.remaining = new Set<string>(Object.keys(this.original))
		this.freq = { ...this.original }
		this.queue = []
	}

	/**
	 * Adds an item to the frequency counter
	 * @param item - The item to add
	 */
	public add(item: string) {
		this.queue.push(item)
		this.freq[item] ??= 0
		this.freq[item] -= 1

		if (this.freq[item] < 0) {
			let removed = this.remove()
			while (removed !== item) {
				removed = this.remove()
			}
		}

		if (this.freq[item] === 0) {
			this.remaining.delete(item)
		}
	}

	/**
	 * Removes the oldest item from the queue
	 * @returns The removed item or undefined if queue is empty
	 */
	private remove(): string | undefined {
		const item = this.queue.shift()

		if (item === undefined) {
			throw new Error('Encountered an impossible state')
		}

		this.freq[item] ??= 0
		this.freq[item] += 1
		this.remaining.add(item)
		return item
	}

	public get isDesiredGroup(): boolean {
		return this.remaining.size === 0
	}

	public get items(){
		return this.queue
	}
}
