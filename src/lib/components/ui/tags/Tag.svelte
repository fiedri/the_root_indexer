<script>
    import { getTagColor } from "$lib/components/ui/tags/tagColors";
    import { IconX, IconTrash } from "@tabler/icons-svelte";

    let {tagInfo, isActive, onclick, onremove}= $props()

    let color = $derived(getTagColor(tagInfo.name))
</script>

{#if !onremove}
<button 
    type="button"
    onclick={onclick}
    class="flex justify-center items-center cursor-pointer text-xs px-3 py-1 rounded transition-all
    {isActive ? `${color.bgActive} text-black font-bold shadow-sm` : `${color.bg} ${color.text} border ${color.border} hover:bg-card`}"
>
    {tagInfo.name}
    {#if isActive}
        <IconX size={12} class="ml-1 opacity-70"/>
    {/if}
</button>
{:else}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    role="button"
    tabindex="0"
    onclick={onclick}
    class="group flex flex-row justify-between items-center text-sm font-bold h-12 px-3 rounded-xl transition-all cursor-pointer w-full
    {isActive ? `${color.bgActive} text-black shadow-inner` : `text-muted-foreground hover:bg-secondary hover:text-foreground`}
">
    <div class="flex justify-between items-center gap-3">
        <div class="{isActive ? 'bg-black' : color.bgActive} w-2 h-2 rounded-full"></div>
        <span>{tagInfo.name}</span>
    </div>
    {#if onremove}
    <div class="flex sm:hidden group-hover:flex text-destructive hover:bg-foreground p-1 rounded">
        <button type="button" onclick={(e) => { e.stopPropagation(); onremove(tagInfo.id); }} aria-label="Eliminar etiqueta">
            <IconTrash size={16}/>
        </button>
    </div>
    {/if}
</div>
{/if}
