<script lang="ts">
  import { IconExternalLink, IconPencil, IconTrash } from "@tabler/icons-svelte";
  import { getTagColor } from "./tags/tagColors";
  interface Props{
    favicon_url?: string,
    title: string,
    domain: string,
    description?: string,
    tags: Array<string>,
    url: string,
    onEdit: ()=> void,
    onDelete: ()=> void,
  }

  let { favicon_url, title, domain, description, tags, url, onEdit, onDelete}: Props = $props();
  import favicon from "$lib/assets/favicon.svg";
 
  const colors = $derived(tags.reduce((acc, current) => {
    const tagName = current.name;
    acc[tagName] = getTagColor(tagName);
    return acc;
  }, {}));
  console.log(colors);
  const displayFavicon = $derived(favicon_url || favicon);
</script>

<article
  class="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50"
>
  <div class="flex items-start gap-4">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background border border-border/50">
      <img src={displayFavicon} alt="" class="h-6 w-6 object-contain" />
    </div>

    <div class="flex flex-1 flex-col min-w-0">
      <div class="flex items-center justify-between gap-2">
        <a 
          href={url} 
          target="_blank" 
          class="flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary min-w-0"
        >
          <span class="truncate text-base">{title}</span>
          <IconExternalLink size={16} class="shrink-0 opacity-70" />
        </a>

        <div class="flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
          <button 
            onclick={onEdit}
            class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            aria-label="Editar"
          >
            <IconPencil size={18} />
          </button>
          <button 
            onclick={onDelete}
            class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Eliminar"
          >
            <IconTrash size={18} />
          </button>
        </div>
      </div>

      <p class="text-sm leading-none text-muted-foreground/70">{domain}</p>

      {#if description}
        <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      {/if}

      <div class="mt-4 flex flex-wrap gap-2">
        {#each tags as tag (tag.id)}
          <button class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-foreground border-l-3
          {colors[tag.name].border}
          cursor-pointer hover:bg-primary transition-colors hover:text-secondary">
            {tag.name}
          </button>
        {/each}
      </div>
    </div>
  </div>
</article>