<script lang="ts">
	import { steps, toggle } from "$lib";

	type Stage = {
		id: number;
		name: string;
	};

	const stages = steps<Stage>([
		{
			id: 1,
			name: "Stage 1"
		},
		{
			id: 2,
			name: "Stage 2"
		},
		{
			id: 3,
			name: "Stage 3"
		}
	]);

	const open = toggle(false);
</script>

<svelte:head>
	<title>svelte-machinery</title>
</svelte:head>

<h1>
	Current stage:
	{JSON.stringify($stages)}
</h1>

<button on:click={() => stages.next()}>Next stage</button>
<button on:click={() => stages.prev()}>Prev stage</button>
<button on:click={() => stages.reset()}>Reset</button>

<button on:click={() => open.toggle()}>Toggle</button>
<button on:click={() => open.on()}>On</button>
<button on:click={() => open.off()}>Off</button>

{#if $open}
	<p>Open</p>
{/if}
