# Svelte Machinery

[![npm version](https://badge.fury.io/js/svelte-machinery.svg)](https://badge.fury.io/js/svelte-machinery)

Svelte Machinery is a state management library that simplifies the implementation of state machines in Svelte applications\. With an intuitive API and TypeScript support, developers can create complex state machines with ease\.

## Installation

---

```
npm install svelte-machinery
```

## Usage

---

The `steps` function creates a machine for managing a set of sequential steps\. Here's an example of how to use it:

```typescript
import { steps, StepMachine } from "svelte-machinery";

type Step = "one" | "two" | "three";

const stepsList: Step[] = ["one", "two", "three"];

const stepMachine = steps<Step[]>(stepsList);

// we could also pass in a options object
const stepMachine = steps<Step[]>(stepsList, {
	init: "two", // this is type safe
	loop: true // this will allow us to "round robin" through the steps
});

// The machine can be used as a Svelte store
$stepMachine; // 'one'

// Move to the next step
stepMachine.next();
$stepMachine; // 'two'

// Move to the previous step
stepMachine.prev();
$stepMachine; // 'one'

// Reset the machine to the initial step
stepMachine.reset();
$stepMachine; // 'one'

// Get the current step once
stepMachine.current; // 'one'

// Get the current step as a subscription
stepMachine.subscribe((step) => {
	console.log(step); // 'one'
});

// or we can call "set" directly
stepMachine.set("three");
stepMachine.reset();

// It's all type safe
stepMachine.set("four"); // Type error: Argument of type '"four"' is not assignable to parameter of type '"one" | "two" | "three"'
```

The `toggle` function creates a machine for managing a boolean value\. Here's an example of how to use it:

```typescript
import { toggle, ToggleMachine } from "svelte-machinery";

const toggleMachine: ToggleMachine = toggle();

// The machine can be used as a Svelte store
$toggleMachine; // false

// Toggle the value
toggleMachine.toggle();
$toggleMachine; // true

// Turn on the value
toggleMachine.on();
$toggleMachine; // true

// Turn off the value
toggleMachine.off();
$toggleMachine; // false
```

The `toggleGroup` function creates a machine for managing multiple boolean values\. Here's an example of how to use it:

```typescript
import { toggleGroup, ToggleGroupMachine } from "svelte-machinery";

type ToggleKeys = "one" | "two" | "three";

const toggleGroupMachine = toggleGroup<ToggleKeys>({
	one: false,
	two: true,
	three: false,
	four: true // Type error: Type '{ one: boolean; two: boolean; three: boolean; four: boolean; }' is not assignable to type '{ one: boolean; two: boolean; three: boolean; }'. Object literal may only specify known properties, and 'four' does not exist in type '{ one: boolean; two: boolean; three: boolean; }'
});

// The machine can be used as a Svelte store
$toggleGroupMachine; // { one: false, two: true, three: false }

// Toggle a specific key
toggleGroupMachine.toggle("one");
$toggleGroupMachine; // { one: true, two: true, three: false }

// Turn on a specific key
toggleGroupMachine.on("two");
$toggleGroupMachine; // { one: true, two: true, three: false }

// Turn off a specific key
toggleGroupMachine.off("two");
$toggleGroupMachine; // { one: true, two: false, three: false }
```

## API

---

### `steps`

```typescript
steps<T>(steps: T[], options?: StepsOptions<T>): StepMachine<T>;
```

Creates a machine for managing a set of sequential steps\. The `steps` argument is an array of values that will be used as the steps\. The `options` argument is an optional object that can be used to configure the machine\. The `init` property can be used to set the initial step\. The `loop` property can be used to enable "round robin" behavior\. The `loop` property is `false` by default\.

### `toggle`

```typescript
toggle(): ToggleMachine;
```

Creates a machine for managing a boolean value\. The `toggle` function does not take any arguments\. The machine can be used to toggle the value between `true` and `false`\. The machine can also be used to turn the value on or off\. The machine can be used as a Svelte store\.

### `toggleGroup`

```typescript
toggleGroup<T extends Record<string, boolean>>(toggles: T): ToggleGroupMachine<T>;
```

Creates a machine for managing multiple boolean values\. The `toggleGroup` function takes an object as an argument\. The keys of the object will be used as the toggle keys\. The values of the object will be used as the initial values\. The machine can be used to toggle the value of a specific key between `true` and `false`\. The machine can also be used to turn the value of a specific key on or off\. The machine can be used as a Svelte store\.

## License

---

[MIT](LICENSE)

## Contributing

---

Contributions are welcome\. Please open an issue or submit a pull request\.

## Acknowledgements

---

This library was inspired by [Svate](https://github.com/AlexxNB/svate); however, Svate is not compatible with TypeScript\.
