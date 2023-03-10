import { steps, toggle, toggleGroup } from "./lib";

import { describe, it, expect } from "vitest";

describe("Step Machine", () => {
	it("should initialize correctly", () => {
		const sm = steps(["step 1", "step 2", "step 3"], { init: 1, loop: true });
		expect(sm.current).toBe("step 2");
	});

	it("should set and get the current state", () => {
		const sm = steps(["step 1", "step 2", "step 3"]);
		sm.set("step 2");
		expect(sm.current).toBe("step 2");
	});

	it("should move to the next state", () => {
		const sm = steps(["step 1", "step 2", "step 3"], { loop: true });
		sm.next();
		expect(sm.current).toBe("step 2");
		sm.next();
		expect(sm.current).toBe("step 3");
		sm.next();
		expect(sm.current).toBe("step 1");
	});

	it("should move to the previous state", () => {
		const sm = steps(["step 1", "step 2", "step 3"], { loop: true });
		sm.prev();
		expect(sm.current).toBe("step 3");
		sm.prev();
		expect(sm.current).toBe("step 2");
		sm.prev();
		expect(sm.current).toBe("step 1");
	});

	it("should reset to the initial state", () => {
		const sm = steps(["step 1", "step 2", "step 3"], { init: 2 });
		sm.next();
		sm.reset();
		expect(sm.current).toBe("step 3");
	});
});

describe("Toggle Machine", () => {
	it("should initialize correctly", () => {
		const tm = toggle();
		expect(tm.current).toBe(false);
	});

	it("should set and get the current state", () => {
		const tm = toggle();
		tm.set(true);
		expect(tm.current).toBe(true);
	});

	it("should toggle the state", () => {
		const tm = toggle(true);
		tm.toggle();
		expect(tm.current).toBe(false);
		tm.toggle();
		expect(tm.current).toBe(true);
	});

	it("should turn on", () => {
		const tm = toggle();
		tm.on();
		expect(tm.current).toBe(true);
	});

	it("should turn off", () => {
		const tm = toggle(true);
		tm.off();
		expect(tm.current).toBe(false);
	});
});

describe("Toggle Group Machine", () => {
	it("should initialize correctly with an object", () => {
		const tgm = toggleGroup({ foo: true, bar: false });
		expect(tgm.subscribe).toBeDefined();
		expect(tgm.set).toBeDefined();
		expect(tgm.toggle).toBeDefined();
		expect(tgm.on).toBeDefined();
		expect(tgm.off).toBeDefined();
	});

	it("should initialize correctly with an array", () => {
		const tgm = toggleGroup(["foo", "bar"]);
		expect(tgm.subscribe).toBeDefined();
		expect(tgm.set).toBeDefined();
		expect(tgm.toggle).toBeDefined();
		expect(tgm.on).toBeDefined();
		expect(tgm.off).toBeDefined();
	});

	it("should set and get the current state", () => {
		const tgm = toggleGroup({ foo: true, bar: false });
		expect(tgm.subscribe).toBeDefined();
		expect(tgm.current).toEqual({ foo: true, bar: false });
	});

	it("should toggle a key", () => {
		const tgm = toggleGroup({ foo: true, bar: false });
		tgm.toggle("foo");
		expect(tgm.current).toEqual({ foo: false, bar: false });
		tgm.toggle("bar");
		expect(tgm.current).toEqual({ foo: false, bar: true });
	});

	it("should turn on a key", () => {
		const tgm = toggleGroup({ foo: true, bar: false });
		tgm.on("bar");
		expect(tgm.current).toEqual({ foo: true, bar: true });
	});

	it("should turn off a key", () => {
		const tgm = toggleGroup({ foo: true, bar: false });
		tgm.off("foo");
		expect(tgm.current).toEqual({ foo: false, bar: false });
	});
});
