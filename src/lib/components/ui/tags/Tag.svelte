<script>
    import { getTagColor } from "$lib/components/ui/tags/tagColors";
    import { IconX, IconTrash } from "@tabler/icons-svelte";
    let {tagInfo, isActive, onclick, onremove}= $props()

    
    let color = $derived(getTagColor(tagInfo.name))
    

</script>
{#if !onremove}
<span class="flex justify-center items-center cursor-pointer text-xs px-3 py-1 rounded {isActive? `${color.bgActive} text-black` :
`${color.bg} ${color.text} border ${color.border} hover:bg-card`} transition-all
">
    {tagInfo.name}
    {#if isActive}
        <IconX size={12} class="ml-1"/>
    {/if}
</span>
{:else}
<div class="group flex flex-row justify-between items-center text-sm font-bold h-12 px-3 rounded-xl transition-all text-muted-foreground w-full
{isActive? `bg-primary/10 border border-primary text-primary`: `hover:bg-secondary hover:text-foreground`}
">
<div class="flex justify-between items-center gap-3">
    <div class="{color.bgActive} w-2 h-2 rounded-full"></div>
<!--   w-full border border-primary rounded-2xl  bg-primary/10 text-primary  -->
<span>
    {tagInfo.name}
</span>
</div>
<div class="flex sm:hidden group-hover:flex text-destructive hover:bg-foreground p-1 rounded">
    <IconTrash size={16}/>
</div>
</div>
{/if}