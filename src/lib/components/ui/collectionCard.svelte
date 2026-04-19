<script lang="ts">
    import { IconShare, IconPencil } from "@tabler/icons-svelte";
    import { page } from "$app/state";
    import { uiState } from "$lib/state.svelte";

    let { name, isPublic, id, description } = $props();
    
    // Ahora es reactivo: se activa si el ID de la URL coincide con este ID
    let active = $derived(page.url.searchParams.get('c') === id);

    function handleEdit(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        uiState.setEditingCollection({ id, name, isPublic, description });
    }
</script>

<div class="group flex flex-row items-center gap-2 px-3 py-3 rounded-xl w-full transition-all duration-200
{active ? 'bg-primary/10 border border-primary text-primary' : 'hover:bg-secondary'}">
    <div class="
        w-1.5 h-1.5 
        aspect-square 
        border border-muted-foreground 
        rotate-45 
        origin-center 
        transition-all duration-150 ease-in-out
        group-hover:border-foreground
        {active ? 'border-primary bg-primary' : ''}
    "></div>
    <span class="text-xs font-bold group-hover:text-foreground text-left w-full
    {active ? 'text-primary' : ''}">{name}</span>
    
    <div class="flex items-center gap-1 shrink-0">
        <button 
            onclick={handleEdit}
            class="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"
            title="Editar colección"
        >
            <IconPencil size={14} />
        </button>
        {#if isPublic}
            <IconShare size={14} class={active ? "text-primary/30 group-hover:text-primary" : "text-muted-foreground group-hover:text-foreground "}/>
        {/if}
    </div>
</div>
