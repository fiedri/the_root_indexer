<script>
import { IconShare } from "@tabler/icons-svelte";
    let {name, isPublic}= $props()
    let active = $state(false)
</script>

<div class="group flex flex-row items-center gap-2 px-3 py-3 rounded-xl w-full transition-all duration-200
{active? `bg-primary/10 border border-primary text-primary`: "hover:bg-secondary"}">
    <div class="
  w-1.5 h-1.5 
  aspect-square 
  border border-muted-foreground 
  rotate-45 
  origin-center 
  transition-all duration-150 ease-in-out
  hover:border-foreground
  {active ? 'border-primary bg-primary' : ''}
"></div>
    <span class="text-xs font-bold group-hover:text-foreground text-left w-full
    {active? 'group-hover:text-primary': ""}">{name}</span>
    {#if isPublic}
        <IconShare size={14} class={active? "text-primary/30 group-hover:text-primary" : "text-muted-foreground group-hover:text-foreground "}/>
    {/if}
</div>