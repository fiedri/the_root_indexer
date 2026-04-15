<script lang="ts">
  import Input from "./input/input.svelte";
  import Button from "./button/Button.svelte";
  import ModalContainer from "./container/ModalContainer.svelte";
  import { getTagColor } from "./tags/tagColors";
  import { IconLink, IconCheck, IconX } from "@tabler/icons-svelte";
  import { fade, scale } from "svelte/transition";

  let tag = $state("");
  let isInvalid = $derived(tag.trim().length === 0);
  let { closeForm, collectionLinks, tags } = $props();

  let selectedCollections: string[] = $state([]);
  let activeTags: string[] = $state([]);

  function toggleCollection(name: string) {
    if (selectedCollections.includes(name)) {
      selectedCollections = selectedCollections.filter((c) => c !== name);
    } else {
      selectedCollections = [...selectedCollections, name];
    }
  }

  function toggleTag(name: string) {
    if (activeTags.includes(name)) {
      activeTags = activeTags.filter((t) => t !== name);
    } else {
      activeTags = [...activeTags, name];
    }
  }

  let mappedtags = $derived(
    tags.map((tag) => {
      return {
        ...tag,
        color: getTagColor(tag),
      };
    })
  );
</script>

<ModalContainer close={closeForm}>
  <div class="flex flex-col gap-1 pt-3 px-5">
    <h2 class="text-lg font-semibold">Añadir nuevo link</h2>
    <p class="text-sm py-2 text-muted-foreground">
      Guarda una url en tu cerebro o asígnala a una colección
    </p>
  </div>
  <div class="px-5">
    <label for="url" class="uppercase text-xs font-medium tracking-normal"
      >Url</label
    >
    <div class="relative flex items-center w-full">
      <div
        class="text-muted-foreground pointer-events-none absolute left-2 flex items-center justify-center"
      >
        <IconLink size={16} />
      </div>
      <Input
        id="url"
        placeholder="https://ejemplo.com/articulo"
        class="pl-8 pr-8 py-4.5 bg-background"
      />
    </div>

    <div class="py-3">
      <p class="uppercase text-xs font-medium tracking-normal mb-2">
        Añadir a colección
      </p>
      {#if collectionLinks.length < 1}
        <p class="text-xs italic font-light text-muted-foreground py-2">
          No hay colecciones aún.
        </p>
      {:else}
        <div
          class="w-full border rounded-xl p-2.5 mb-4 bg-muted/30 flex gap-2 flex-wrap"
        >
          {#each collectionLinks as collection (collection.name)}
            {@const isActive = selectedCollections.includes(collection.name)}
            <button
              class="text-[11px] font-medium cursor-pointer border rounded-lg py-1.5 px-3 flex items-center gap-1.5 transition-all duration-200
              {isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]'
                : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted'}"
              onclick={() => toggleCollection(collection.name)}
            >
              {collection.name}
              {#if isActive}
                <div transition:scale={{ duration: 150 }}>
                  <IconCheck size={12} />
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      <label for="tag" class="uppercase text-xs font-medium tracking-normal"
        >Etiquetas</label
      >
      {#if mappedtags.length > 0}
        <div class="w-full rounded-xl p-2.5 mt-1 mb-4 flex gap-2 flex-wrap">
          {#each mappedtags as tagItem (tagItem.name)}
            {@const isActive = activeTags.includes(tagItem.name)}
            <button
              class="inline-flex items-center justify-center rounded-lg px-3 py-1 font-medium transition-all duration-200 cursor-pointer text-[11px] border
              {isActive
                ? `${tagItem.color.bgActive} border-transparent shadow-sm scale-[1.02] text-secondary`
                : `bg-background ${tagItem.color.text} ${tagItem.color.border} hover:brightness-95`}"
              onclick={() => toggleTag(tagItem.name)}
            >
              {tagItem.name}
              {#if isActive}
                <div transition:scale={{ duration: 150 }} class="ml-1.5">
                  <IconCheck size={12} />
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      <div class="relative flex items-center w-full gap-2">
        <Input
          placeholder="crea una nueva etiqueta..."
          id="tag"
          class="py-4.5 bg-background"
          bind:value={tag}
        />
        <Button
          variant="outline"
          disabled={isInvalid}
          class="disabled:pointer-events-none disabled:opacity-50"
        >
          Añadir
        </Button>
      </div>
    </div>

    <div class="flex sm:flex-row justify-end py-6 border-t border-border gap-3">
      <Button
        variant="ghost"
        class="hover:bg-destructive/10 hover:text-destructive transition-colors"
        onclick={closeForm}
      >
        Cancelar
      </Button>
      <Button class="px-8">Guardar link</Button>
    </div>
  </div>
</ModalContainer>