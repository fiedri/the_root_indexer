<script lang="ts">
	import { IconSearch, IconX } from "@tabler/icons-svelte";
	import Input from "./input.svelte";
	import { cn } from "$lib/utils.js";
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = HTMLInputAttributes & {
		value?: string;
	};

	let { value = $bindable(""), class: className, ...restProps }: Props = $props();

	function clearSearch() {
		value = "";
	}
</script>

<div class={cn("relative flex items-center w-full", className)}>
	<div
		class="text-muted-foreground pointer-events-none absolute left-2 flex items-center justify-center"
	>
		<IconSearch size={16} />
	</div>

	<Input
		type="text"
		bind:value
		class="pl-8 pr-8 py-4"
		{...restProps}
	/>

	{#if value && value.length > 0}
		<button
			type="button"
			onclick={clearSearch}
			class="text-muted-foreground transition-all absolute right-2 flex items-center justify-center transition-colors hover:bg-primary rounded p-1 hover:text-black"
			aria-label="Limpiar búsqueda"
		>
			<IconX size={14} stroke={2.5} />
		</button>
	{/if}
</div>
