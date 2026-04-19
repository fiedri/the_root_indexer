<script lang="ts">
  import { IconExternalLink, IconPencil, IconTrash, IconCopy, IconCheck } from "@tabler/icons-svelte";
  import { getTagColor } from "./tags/tagColors";
  import type { Tagt } from "$lib/types/db";
  import { cn } from "$lib/utils";
  import faviconFallback from "$lib/assets/favicon.svg";
  import ModalContainer from "./container/ModalContainer.svelte";
  import Input from "./input/input.svelte";
  import Textarea from "./textarea/textarea.svelte";
  import { uiState } from "$lib/state.svelte";
  import Button from "./button/Button.svelte";
  import { enhance } from "$app/forms";

  interface Props {
    id: string
    favicon_url?: string;
    title: string;
    domain: string | undefined;
    description?: string;
    tags: Array<Tagt>;
    url: string;
    onEdit?: string;
    onDelete?: (id: string) => void;
  }

  let { id, favicon_url, title, domain, description, tags, url, onEdit, onDelete }: Props = $props();

  let copied = $state(false);
  let faviconError = $state(false);

  const displayDomain = $derived(
    domain || 
    (() => {
      try {
        return new URL(url).hostname.replace(/^www\./, "");
      } catch {
        return "";
      }
    })()
  );

  const colors = $derived(
    tags.reduce((acc, current) => {
      const tagName = current.name;
      acc[tagName] = getTagColor(tagName);
      return acc;
    }, {} as Record<string, any>)
  );

  const displayFavicon = $derived(faviconError || !favicon_url ? faviconFallback : favicon_url);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  function handleImageError() {
    faviconError = true;
  }
  let isEditing = $state(false);

  let selectedTagIds = $state(new Set<string>());

  $effect(() => {
    if (isEditing) {
      selectedTagIds = new Set(tags.map(t => t.id));
    }
  });

  function toggleTag(tagId: string) {
    if (selectedTagIds.has(tagId)) {
      selectedTagIds.delete(tagId);
    } else {
      selectedTagIds.add(tagId);
    }
    selectedTagIds = new Set(selectedTagIds);
  }
</script>

<article
  class="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md w-full ring-1 ring-foreground/5 min-h-30 justify-start"
>
  <!-- Vista Móvil (Stacked) -->
  <div class="flex flex-col gap-3 sm:hidden">
    <div class="flex items-center gap-3">
      {@render Favicon()}
      {@render TitleLink()}
    </div>
    
    <div class="flex items-center justify-between gap-2">
      {@render DomainLabel()}
      {#if !tags?.length && !onEdit && !onDelete}
        <div class="flex items-center gap-1 shrink-0">
          {@render ActionButtons(true)}
        </div>
      {/if}
    </div>

    {@render DescriptionText()}
    
    {#if tags?.length || onEdit || onDelete}
      {@render TagsList()}
      <div class="flex items-center gap-1 justify-end pt-2 border-t border-border/40">
        {@render ActionButtons(true)}
      </div>
    {/if}
  </div>

  <!-- Vista Tablet/Desktop (2 Columns) -->
  <div class="hidden sm:flex items-start gap-4">
    <div class="shrink-0">
      {@render Favicon()}
    </div>

    <div class="flex flex-1 flex-col min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-col min-w-0 flex-1">
          {@render TitleLink()}
          {@render DomainLabel()}
        </div>

        <div class="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
          {@render ActionButtons()}
        </div>
      </div>

      {@render DescriptionText()}

      <div class="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {@render TagsList()}

        <div class="flex lg:hidden items-center gap-1 shrink-0 justify-end">
          {@render ActionButtons(true)}
        </div>
      </div>
    </div>
  </div>
</article>

{#snippet Favicon()}
  <div class="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-background border border-border/50 shadow-inner overflow-hidden transition-all group-hover:border-primary/30">
    <img 
      src={displayFavicon} 
      alt="" 
      class="h-6 w-6 sm:h-7 sm:w-7 object-contain transition-transform duration-300 group-hover:scale-110" 
      onerror={handleImageError}
    />
  </div>
{/snippet}

{#snippet TitleLink()}
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    class="flex items-start gap-1.5 font-bold text-foreground transition-colors hover:text-primary min-w-0 group/link"
    title={title}
  >
    <span class="line-clamp-2 sm:truncate text-lg leading-tight tracking-tight">{title}</span>
    <IconExternalLink size={16} class="shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity mt-1" />
  </a>
{/snippet}

{#snippet DomainLabel()}
  <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 sm:mt-1">{displayDomain}</p>
{/snippet}

{#snippet DescriptionText()}
  {#if description}
    <p class="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground/80 font-medium">
      {description}
    </p>
  {/if}
{/snippet}

{#snippet TagsList()}
  {#if tags && tags.length > 0}
    <div class="mt-2 sm:mt-0 flex flex-wrap gap-2">
      {#each tags as tag (tag.id)}
        {@const isFilterActive = uiState.isTagFilterActive(tag.id)}
        {@const tagColor = getTagColor(tag.name)}
        <button 
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            uiState.toggleFilterTag(tag.id);
          }}
          class={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold border-l-3 transition-all cursor-pointer",
            isFilterActive 
              ? `${tagColor.bgActive} text-black ${tagColor.border}`
              : `${tagColor.bg} ${tagColor.text} ${tagColor.border}`,
            "hover:brightness-90 active:scale-95"
          )}
        >
          {tag.name}
          {#if isFilterActive}
            <IconCheck size={12} stroke={3} />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet ActionButtons(isMobile = false)}
  <button 
    onclick={copyToClipboard}
    class={cn(
      "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
      copied ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-muted-foreground hover:bg-secondary hover:text-primary"
    )}
    title={copied ? "¡Copiado!" : "Copiar enlace"}
    aria-label="Copiar enlace"
  >
    {#if copied}
      <IconCheck size={18} />
    {:else}
      <IconCopy size={18} />
    {/if}
  </button>

  {#if onEdit}
    <button 
      onclick={()=>isEditing=!isEditing}
      class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-primary"
      title="Editar"
      aria-label="Editar"
    >
      <IconPencil size={18} />
    </button>
  {/if}

  {#if onDelete}
    <button 
      onclick={()=>onDelete(id)}
      class={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
        isMobile ? "bg-destructive/10 text-destructive sm:bg-transparent" : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      )}
      title="Eliminar"
      aria-label="Eliminar"
    >
      <IconTrash size={18} />
    </button>
  {/if}
{/snippet}
{#if isEditing}
<ModalContainer close={()=>isEditing=false}>
  <form 
    action="?/updateLink" 
    method="POST"
    class="p-6"
    use:enhance={() => {
      // Cerramos el modal inmediatamente
      isEditing = false;
      return async ({ update }) => {
        await update();
      };
    }}
  >
  <input type="hidden" name='id' value={id}>
    <h2 class="text-xl font-bold">Editar</h2>
    <p class="text-sm font-light text-muted-foreground">Edita titulo, etiquetas y descripcion para este link</p>
    <div class="p-3 border-primary/10 border rounded-2xl mt-10">
      <div class="flex flex-row items-center gap-3">
        <img src="{favicon_url}" alt="" class="rounded-xl h-10 w-10">
        <span class="uppercase text-muted-foreground text-xs">{domain}</span>
      </div>
      <div class="flex flex-col gap-2 mt-3 mb-3">
        <div>
                  <label for="titulo" class="uppercase text-xs">Titulo</label>
        <Input type="text" id="titulo" name="titulo" bind:value={title}/>
        </div>
        <div>
          <label for="description" class="uppercase text-xs">Descripcion</label>
        <Textarea name="description" id="description" bind:value={description}/>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <span class="uppercase text-xs font-bold text-muted-foreground"># Manejo de Etiquetas</span>
      <div class="mt-2 flex flex-wrap gap-2">
        {#each uiState.allTags as tag}
          {@const tagColors = getTagColor(tag.name)}
          {@const isSelected = selectedTagIds.has(tag.id)}
          <button
            type="button"
            onclick={() => toggleTag(tag.id)}
            class={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold border-l-2 transition-all cursor-pointer",
              isSelected 
                ? `${tagColors.bg} ${tagColors.text} ${tagColors.border} shadow-sm scale-105`
                : "bg-muted/30 text-muted-foreground/60 border-transparent opacity-70 hover:opacity-100 hover:bg-muted/50"
            )}
          >
            {tag.name}
            {#if isSelected}
              <IconCheck size={12} stroke={3} />
            {/if}
          </button>
        {/each}
      </div>
      
      <!-- Campos ocultos para enviar las etiquetas seleccionadas -->
      {#each Array.from(selectedTagIds) as tagId}
        <input type="hidden" name="tags" value={tagId} />
      {/each}
    </div>

    <div class="mt-8 flex justify-end gap-2">
      <Button variant="ghost" type="button" onclick={() => isEditing = false} class="hover:bg-destructive">
        Cancelar
      </Button>
      <Button variant="primary" type="submit">
        Guardar cambios
      </Button>
    </div>
  </form>
</ModalContainer>
{/if}