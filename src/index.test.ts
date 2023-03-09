import { describe, beforeEach, it, expect } from "vitest";
import { steps, toggle } from "./lib";
import type { StepMachine, ToggleMachine } from "./lib";

describe("machine() test", () => {
	type State = "a" | "b" | "c";
	let testSteps: StepMachine<State>;
	let currentState: State;

	beforeEach(() => {
		testSteps = steps<State>(["a", "b", "c"], { init: 1 });
		testSteps.subscribe((state) => {
			currentState = state;
		});
	});

	it("should initize with the correct state", () => {
		expect(currentState).toBe("b");
	});

	it("should transition to the next state", () => {
		testSteps.next();
		expect(currentState).toBe("c");
	});

	it("should transition to the previous state", () => {
		testSteps.prev();
		expect(currentState).toBe("a");
	});

	it("should not transition to the next state if it's the last state", () => {
		testSteps.next();
		testSteps.next();
		testSteps.next();
		expect(currentState).toBe("c");
	});

	it("should not transition to the previous state if it's the first state", () => {
		testSteps.prev();
		testSteps.prev();
		testSteps.prev();
		expect(currentState).toBe("a");
	});

	it("should transition to the first state if it's the last state and loop is true", () => {
		testSteps = steps(["a", "b", "c"], { init: 2, loop: true });
		testSteps.subscribe((state) => {
			currentState = state;
		});
		testSteps.next();
		expect(currentState).toBe("a");
	});

	it("should reset to the init state", () => {
		testSteps.next();
		testSteps.reset();
		expect(currentState).toBe("b");
	});

	it("should return the current value", () => {
		testSteps.set("b");
		expect(testSteps.current).toBe("b");
	});
});

describe("toggle() test", () => {
	let testToggle: ToggleMachine;
	let currentState: boolean;

	beforeEach(() => {
		testToggle = toggle(false);
		testToggle.subscribe((state) => {
			currentState = state;
		});
	});

	it("should initize with the correct state", () => {
		expect(currentState).toBe(false);
	});

	it("should toggle the state", () => {
		testToggle.toggle();
		expect(currentState).toBe(true);
	});

	it("should set the state to true", () => {
		testToggle.on();
		expect(currentState).toBe(true);
	});

	it("should set the state to false", () => {
		testToggle.off();
		expect(currentState).toBe(false);
	});
});
