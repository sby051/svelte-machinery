import { describe, beforeEach, it, expect } from "vitest";
import { steps, toggle } from "./lib";
import type { StepMachine, ToggleMachine } from "./lib";

describe("machine() test", () => {
	type State = "a" | "b" | "c";
	let steps: StepMachine<State>;
	let currentState: State;

	beforeEach(() => {
		steps = steps<State>(["a", "b", "c"], { init: 1 });
		steps.subscribe((state) => {
			currentState = state;
		});
	});

	it("should initize with the correct state", () => {
		expect(currentState).toBe("b");
	});

	it("should transition to the next state", () => {
		steps.next();
		expect(currentState).toBe("c");
	});

	it("should transition to the previous state", () => {
		steps.prev();
		expect(currentState).toBe("a");
	});

	it("should not transition to the next state if it's the last state", () => {
		steps.next();
		steps.next();
		steps.next();
		expect(currentState).toBe("c");
	});

	it("should not transition to the previous state if it's the first state", () => {
		steps.prev();
		steps.prev();
		steps.prev();
		expect(currentState).toBe("a");
	});

	it("should transition to the first state if it's the last state and loop is true", () => {
		steps = steps(["a", "b", "c"], { init: 2, loop: true });
		steps.subscribe((state) => {
			currentState = state;
		});
		steps.next();
		expect(currentState).toBe("a");
	});

	it("should reset to the init state", () => {
		steps.next();
		steps.reset();
		expect(currentState).toBe("b");
	});

	it("should return the current value", () => {
		steps.set("b");
		expect(steps.current).toBe("b");
	});
});

describe("toggle() test", () => {
	let toggle: ToggleMachine;
	let currentState: boolean;

	beforeEach(() => {
		toggle = toggle(false);
		toggle.subscribe((state) => {
			currentState = state;
		});
	});

	it("should initize with the correct state", () => {
		expect(currentState).toBe(false);
	});

	it("should toggle the state", () => {
		toggle.toggle();
		expect(currentState).toBe(true);
	});

	it("should set the state to true", () => {
		toggle.on();
		expect(currentState).toBe(true);
	});

	it("should set the state to false", () => {
		toggle.off();
		expect(currentState).toBe(false);
	});
});
