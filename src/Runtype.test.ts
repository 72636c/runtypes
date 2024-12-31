import Number from "./Number.ts"
import Runtype from "./Runtype.ts"
import FAILURE from "./utils-internal/FAILURE.ts"
import SUCCESS from "./utils-internal/SUCCESS.ts"
import { assert, assertEquals, assertFalse, assertNotEquals } from "@std/assert"

Deno.test("Runtype", async t => {
	await t.step("base object", async t => {
		const base = { tag: "R" }
		const R = Runtype.create<Runtype.Common<42>>(
			value => (value === 42 ? SUCCESS(value) : FAILURE.VALUE_INCORRECT("number", 42, value)),
			base,
		)
		assertEquals(base, R)
		assert(R.guard(42))
		assertFalse(R.guard(24))
	})
	await t.step("base function", async t => {
		const base = Object.assign(() => 42, { tag: "R" })
		const R = Runtype.create<Runtype.Common<42> & (() => 42)>(
			value => (value === 42 ? SUCCESS(value) : FAILURE.VALUE_INCORRECT("number", 42, value)),
			base,
		)
		assertEquals(typeof R, "function")
		assertEquals(base, R)
		assertEquals(R(), 42)
		assert(R.guard(42))
		assertFalse(R.guard(24))
	})
	await t.step("`with`", async t => {
		const method = () => 42 as const
		const base = { tag: "R" }
		const R = Runtype.create<Runtype.Common<42>>(
			value => (value === 42 ? SUCCESS(value) : FAILURE.VALUE_INCORRECT("number", 42, value)),
			base,
		).with({ method })
		assertNotEquals(base, R)
		assertEquals(R.method, method)
		assert(R.guard(42))
		assertFalse(R.guard(24))
	})
	await t.step("and", async t => {
		const base = { tag: "R" }
		const R = Runtype.create<Runtype.Common<42>>(
			value => (value === 42 ? SUCCESS(value) : FAILURE.VALUE_INCORRECT("number", 42, value)),
			base,
		).and(Number)
		assert(R.guard(42))
	})
	await t.step("withConstraint", async t => {
		const base = { tag: "R" }
		const R = Runtype.create<Runtype.Common<42>>(
			value => (value === 42 ? SUCCESS(value) : FAILURE.VALUE_INCORRECT("number", 42, value)),
			base,
		)
			.with({ hello: "hello" })
			.withConstraint(() => true)
		assert(R.guard(42))
	})
})