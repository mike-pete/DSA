import { describe, expect, test } from 'bun:test'
import RollingFreq from './RollingFreq'

describe('RollingFreq', () => {
	test('should throw on empty input', () => {
		expect(() => new RollingFreq({})).toThrow('Frequency requirements cannot be empty')
	})

	test('should throw on invalid frequencies', () => {
		expect(() => new RollingFreq({ a: -1 })).toThrow('Invalid value for desired frequency.')
		expect(() => new RollingFreq({ a: 1.5 })).toThrow('Invalid value for desired frequency.')
	})

	test('should track frequencies', () => {
		const x = new RollingFreq({ a: 2, b: 1 })

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual(['aa'])

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual(['a', 'a'])

		x.add('b')
		expect(x.isDesiredGroup).toBe(true)
		expect(x.items).toEqual(['a', 'a', 'b'])
	})

	test('should drop items correctly', () => {
		const x = new RollingFreq({ a: 2, b: 1 })

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual(['a'])

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual(['a', 'a'])

		x.add('b')
		expect(x.isDesiredGroup).toBe(true)
		expect(x.items).toEqual(['a', 'a', 'b'])

		x.add('b')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual(['b'])
	})

	test('should handle excluded items', () => {
		const x = new RollingFreq({ a: 0, b: 1 })

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual([])

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual([])

		x.add('b')
		expect(x.isDesiredGroup).toBe(true)
		expect(x.items).toEqual(['b'])

		x.add('b')
		expect(x.isDesiredGroup).toBe(true)
		expect(x.items).toEqual(['b'])
	})

	test('should handle unspecified items', () => {
		const x = new RollingFreq({ b: 1 })

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual([])

		x.add('b')
		expect(x.isDesiredGroup).toBe(true)
		expect(x.items).toEqual(['b'])

		x.add('a')
		expect(x.isDesiredGroup).toBe(false)
		expect(x.items).toEqual([])
	})
})
