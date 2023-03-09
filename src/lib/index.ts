import { writable, type Writable } from "svelte/store";

export type StepMachine<T> = Readonly<{
	/**
	 * The subscribe function of the machine.
	 * @type {function}
	 * @returns {function} The unsubscribe function.
	 */
	subscribe: Writable<T>["subscribe"];

	/**
	 * The set function of the machine.
	 * @type {function}
	 * @param {T} value The value to set.
	 */
	set: (value: T) => void;

	/**
	 * Move to the next state
	 * When the current state is the last state, the machine will either loop back to the first state or stay at the last state.
	 * @type {function}
	 */
	next: () => void;

	/**
	 * Move to the previous state.
	 * When the current state is the first state, the machine will either loop back to the last state or stay at the first state.
	 * @type {function}
	 */
	prev: () => void;

	/**
	 * Reset the machine to the initial state.
	 * @type {function}
	 */
	reset: () => void;

	/**
	 * Getter for the current state of the machine.
	 * @type {T}
	 */
	get current(): T;
}>;

export type StepMachineOptions = {
	/**
	 * The initial state index.
	 * @type {number}
	 * @default 0
	 */
	init?: number;

	/**
	 * Whether to loop back to the first state after the last state.
	 * @type {boolean}
	 * @default false
	 */
	loop?: boolean;
};

/**
 * A utility function to create a step machine.
 * @template T The type of the step states.
 * @param {T[]} states The states of the machine.
 * @param {StepMachineOptions} [options] The options for the machine.
 * @param {number} [options.init=0] The initial state index.
 * @param {boolean} [options.loop=false] Whether to loop back to the first state after the last state.
 * @returns {StepMachine<T>} The step machine.
 */
export const steps = <T>(steps: T[], options?: StepMachineOptions): StepMachine<T> => {
	const { init = 0, loop = false } = options || {};
	const { subscribe, set, update } = writable(steps[init]);

	return {
		subscribe,
		set,
		next: () => {
			update((step) => {
				const index = steps.indexOf(step);
				const nextIndex = index + 1;
				if (nextIndex >= steps.length) {
					return loop ? steps[0] : step;
				}
				return steps[nextIndex];
			});
		},
		prev: () => {
			update((step) => {
				const index = steps.indexOf(step);
				const previousIndex = index - 1;
				if (previousIndex < 0) {
					return loop ? steps[steps.length - 1] : step;
				}
				return steps[previousIndex];
			});
		},
		reset: () => set(steps[init]),
		get current() {
			let step;
			subscribe((value) => (step = value))();
			return step as T;
		}
	};
};

export type ToggleMachine = Readonly<{
	subscribe: Writable<boolean>["subscribe"];
	set: (value: boolean) => void;
	toggle: () => void;
	on: () => void;
	off: () => void;
}>;

/**
 * A utility function to create a toggle machine.
 * @param {boolean} init The initial state of the machine. Defaults to false.
 * @returns {ToggleMachine} The toggle machine.
 */
export const toggle = (init = false): ToggleMachine => {
	const { subscribe, set, update } = writable(init);

	return {
		subscribe,
		set,
		toggle: () => update((value) => !value),
		on: () => set(true),
		off: () => set(false)
	};
};

export type ToggleGroupMachine<T extends string> = Readonly<{
	subscribe: Writable<Record<T, boolean>>["subscribe"];
	set: (value: Record<T, boolean>) => void;
	toggle: (key: T) => void;
	on: (key: T) => void;
	off: (key: T) => void;
}>;

/**
 * A utility function to create a toggles machine.
 * @template T The type of the toggle keys.
 * @param {Record<T, boolean> | T[]} init The initial state of the machine. If an array is passed, the keys will be set to false, otherwise the keys will be set to the value of the corresponding key.
 * @returns {ToggleGroupMachine} The toggles machine.
 */
export const toggleGroup = <T extends string>(
	init: Record<T, boolean> | T[]
): ToggleGroupMachine<T> => {
	if (Array.isArray(init)) {
		init = init.reduce((acc, key) => ({ ...acc, [key]: false }), {}) as Record<T, boolean>;
	}

	const { subscribe, set, update } = writable(init);

	return {
		subscribe,
		set,
		toggle: (key: T) => update((value) => ({ ...value, [key]: !value[key] })),
		on: (key: T) => update((value) => ({ ...value, [key]: true })),
		off: (key: T) => update((value) => ({ ...value, [key]: false }))
	};
};

// type ValidatedStep<T> = {
// 	step: T;
// 	validator?: (state: T) => boolean;
// };

// export const validatedSteps = <T>(
// 	step: ValidatedStep<T>[],
// 	options?: StepMachineOptions
// ) => {
// 	const { init = 0, loop = false } = options || {};

// 	const { subscribe, set, update } = writable(step[init].step);

// 	const canTransition = (state: T) =>
// 		step.find((validatedState) =>
// 			validatedState.step === state
// 				? !validatedState.validator || validatedState.validator(state)
// 				: false
// 		) !== undefined;

// 	return {
// 		subscribe,
// 		set,
// 		next: () => {
// 			update((state) => {
// 				const index = step.findIndex((validatedState) => validatedState.step === state);
// 				let nextIndex = index + 1;
// 				while (nextIndex < step.length && !canTransition(step[nextIndex].step)) {
// 					nextIndex++;
// 				}
// 				if (nextIndex >= step.length) {
// 					return loop ? step[0].step : state;
// 				}
// 				return step[nextIndex].step;
// 			});
// 		},
// 		prev: () => {
// 			update((state) => {
// 				const index = step.findIndex((validatedState) => validatedState.step === state);
// 				let previousIndex = index - 1;
// 				while (previousIndex >= 0 && !canTransition(step[previousIndex].step)) {
// 					previousIndex--;
// 				}
// 				if (previousIndex < 0) {
// 					return loop ? step[step.length - 1].step : state;
// 				}
// 				return step[previousIndex].step;
// 			});
// 		},
// 		first: () => {
// 			const validatedState = step.find(
// 				(validatedState) => !validatedState.validator || validatedState.validator(step[0].step)
// 			);
// 			if (validatedState) {
// 				set(validatedState.step);
// 			}
// 		},
// 		last: () => {
// 			const validatedState = step
// 				.slice()
// 				.reverse()
// 				.find(
// 					(validatedState) =>
// 						!validatedState.validator || validatedState.validator(step[step.length - 1].step)
// 				);
// 			if (validatedState) {
// 				set(validatedState.step);
// 			}
// 		},
// 		reset: () => set(step[init].step),
// 		get current() {
// 			let state;
// 			subscribe((value) => (state = value))();
// 			return state;
// 		},
// 		get isFirst() {
// 			return step.findIndex((validatedState) => validatedState.step === this.current) === 0;
// 		},
// 		get isLast() {
// 			return (
// 				step.findIndex((validatedState) => validatedState.step === this.current) ===
// 				step.length - 1
// 			);
// 		}
// 	} as const;
// };
