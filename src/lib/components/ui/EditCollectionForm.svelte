<script lang="ts">
  import Button from "./button/Button.svelte";
  import ModalContainer from "./container/ModalContainer.svelte";
  import { IconCheck, IconTrash } from "@tabler/icons-svelte";
  import Input from "./input/input.svelte";
  import SearchInput from "./input/search-input.svelte";
  import { getTagColor } from "./tags/tagColors";
  import { enhance } from "$app/forms";
  import { uiState } from "$lib/state.svelte";

  let { close, allLinks, tags, relations } = $props<{
    close: () => void;
    allLinks: any[];
    tags: any[];
    relations: any[];
  }>();

  // Initialize from editingCollection
  const collection = uiState.editingCollection;
  
  // Initialize state
  let name = $state(collection?.name || "");
  let description = $state(collection?.description || "");
  let isPublic = $state(collection?.isPublic || false);
  let searchQuery = $state("");
  let selectedIds = $state(new Set<string>());

  // Use effect to populate selectedIds from relations once or whenever they change
  $effect(() => {
    const currentIds = relations
      .filter(r => r.collectionId === collection?.id)
      .map(r => r.linkId);
    selectedIds = new Set(currentIds);
  });
  
  let filterTags = $state(new Set<string>());
  let isSubmitting = $state(false);

  // Derived filtered links
  let filteredLinks = $derived(
    allLinks.filter((link) => {
      // Filter by tags
      const linkTagIds = link.tags?.map((t: any) => t.id) || [];
      const matchesTags =
        filterTags.size === 0 ||
        Array.from(filterTags).every((ft) => linkTagIds.includes(ft));

      // Filter by search query
      const matchesSearch =
        searchQuery.trim() === "" ||
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTags && matchesSearch;
    })
  );

  function toggleSelection(id: string) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }
    selectedIds = new Set(selectedIds);
  }

  function toggleFilterTag(tagId: string) {
    if (filterTags.has(tagId)) {
      filterTags.delete(tagId);
    } else {
      filterTags.add(tagId);
    }
    filterTags = new Set(filterTags);
  }

  function clearFilters() {
    filterTags = new Set();
    searchQuery = "";
  }
</script>

<ModalContainer {close}>
  <div class="p-3 border-border border-b flex justify-between items-center">
    <div>
        <h2 class="text-lg font-bold">Editar colección</h2>
        <p class="text-sm text-muted-foreground font-light tracking-tight">
          Modifique los detalles de su colección.
        </p>
    </div>
    <form action="?/deleteCollection" method="POST" use:enhance={() => {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success') {
                close();
            }
            await update();
        };
    }}>
        <input type="hidden" name="id" value={collection.id} />
        <Button type="submit" variant="ghost" class="text-destructive hover:bg-destructive/10 mt-5 mr-5" disabled={isSubmitting}>
            <IconTrash size={18} />
        </Button>
    </form>
  </div>

  <form
    class="flex flex-col overflow-hidden min-h-0 gap-3 text-muted-foreground"
    method="POST"
    action="?/updateCollection"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ result, update }) => {
        isSubmitting = false;
        if (result.type === "success") {
          close();
        }
        await update();
      };
    }}
  >
    <input type="hidden" name="id" value={collection.id} />
    
    <div
      class="flex-1 overflow-y-auto space-y-5 box-border max-h-80 px-6 mt-3 pt-6"
    >
      <div>
        <label for="name" class="uppercase text-sm font-bold block mb-1">Nombre</label>
        <Input id="name" name="name" placeholder="e.j. Rust Roadmap" bind:value={name} required />
      </div>

      <div>
        <label for="description" class="uppercase text-sm font-bold block mb-1">Descripción</label>
        <textarea
          name="description"
          id="description"
          bind:value={description}
          class="bg-card focus-visible:border-primary focus-visible:ring-primary/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border text-sm transition-colors focus-visible:ring-2 md:text-xs/relaxed placeholder:text-muted-foreground w-full min-w-0 outline-none p-2 resize-none h-24"
          placeholder="¿Sobre qué es la colección?"
        ></textarea>
      </div>

      <div
        class="flex justify-between items-center border-border border rounded-xl p-2.5 bg-card"
      >
        <div class="flex flex-col">
          <p class="uppercase text-sm font-bold">Colección pública</p>
          <p class="text-xs tracking-tight">Visible para cualquier persona con el enlace.</p>
        </div>
        <label class="inline-flex items-center cursor-pointer" for="isPublicEdit">
          <input
            type="checkbox"
            name="isPublic"
            bind:checked={isPublic}
            class="sr-only peer"
            id="isPublicEdit"
          />
          <div
            class="peer-checked:bg-primary/30 relative w-9 h-5 bg-black peer-focus:outline-none transition-all rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary after:rounded-full after:h-4 after:w-4 after:transition-all"
          ></div>
        </label>
      </div>

      <div class="flex-1 space-y-5 box-border min-h-0">
        <div class="flex justify-between items-center border-border border-b pb-1">
          <span class="uppercase text-sm font-bold">Selección de links</span>
          <p class="inline border-border border rounded-xl px-2 uppercase text-xs">
            <span>{selectedIds.size}</span> seleccionados
          </p>
        </div>
        
        <div class="space-y-3">
          <SearchInput placeholder="Filtrar por título o url..." bind:value={searchQuery} />
          
          <div class="w-full border rounded-lg py-1.5 bg-muted/30 flex gap-2 flex-wrap px-2">
            <button
              type="button"
              class="inline px-2 py-1 {filterTags.size === 0 && searchQuery === '' ? 'bg-primary text-secondary' : 'bg-background hover:bg-muted'} text-[10px] rounded font-bold transition-colors"
              onclick={clearFilters}
            >
              Todos
            </button>
            
            {#each tags as tag}
              {@const colors = getTagColor(tag.name)}
              {@const isActive = filterTags.has(tag.id)}
              <button
                type="button"
                class="flex flex-row items-center justify-center gap-1 px-2 py-1 transition-all text-[10px] rounded font-bold border cursor-pointer
                {isActive ? `${colors.bgActive} ${colors.textActive || 'text-secondary'} ${colors.borderActive || colors.border}` : `${colors.bg} ${colors.text} ${colors.border}`}
                hover:opacity-80"
                onclick={() => toggleFilterTag(tag.id)}
              >
                {tag.name}
                {#if isActive}
                  <IconCheck size={12} />
                {/if}
              </button>
            {/each}
          </div>

          <div class="rounded-md border-border border box-border overflow-hidden">
            <div class="max-h-56 min-h-[100px] overflow-y-auto p-1 space-y-1 bg-card flex flex-col gap-1">
              {#if filteredLinks.length > 0}
                {#each filteredLinks as link (link.id)}
                  <button
                    type="button"
                    class="group w-full text-left gap-2 rounded-md p-2 cursor-pointer flex flex-row items-center justify-between transition-all ease-in-out border
                    {selectedIds.has(link.id) ? 'bg-primary/10 border-primary' : 'bg-transparent border-transparent hover:bg-muted'}"
                    onclick={() => toggleSelection(link.id)}
                  >
                    <div class="flex flex-col min-w-0">
                      <span class="text-xs font-bold truncate {selectedIds.has(link.id) ? 'text-primary' : 'text-foreground'}">
                        {link.title}
                      </span>
                      <span class="text-[10px] text-muted-foreground truncate">{link.url}</span>
                    </div>
                    <div class="shrink-0 h-5 w-5 rounded-full border border-border flex items-center justify-center transition-colors
                    {selectedIds.has(link.id) ? 'bg-primary border-primary' : 'bg-background'}">
                      {#if selectedIds.has(link.id)}
                      <input type="hidden" name="link" value={link.id}>
                        <IconCheck size={12} class="text-secondary" />
                      {/if}
                    </div>
                  </button>
                {/each}
              {:else}
                <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p class="text-[10px]">No se encontraron enlaces.</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2 justify-end border-border border-t p-4 mt-auto">
      <Button
        type="button"
        variant="ghost"
        class="hover:bg-destructive/10 hover:text-destructive"
        onclick={close}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={!name.trim() || isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  </form>
</ModalContainer>