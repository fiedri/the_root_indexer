<script lang="ts">
  import Input from "./input/input.svelte";
  import Button from "./button/Button.svelte";
  import ModalContainer from "./container/ModalContainer.svelte";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { getTagColor } from "./tags/tagColors";
  import {
    IconLink,
    IconCheck,
    IconEdit,
    IconLoader2,
  } from "@tabler/icons-svelte";
  import { scale, fade } from "svelte/transition";
  import { enhance } from "$app/forms";

  let tag = $state("");
  let isInvalid = $derived(tag.trim().length === 0);
  let { closeForm, collectionLinks, tags } = $props();

  let selectedCollections: any[] = $state([]);
  let activeTags: any[] = $state([]);
  let optimisticTags = $state<any[]>([]);

  let allTags = $derived([
    ...tags,
    ...optimisticTags.filter(
      (ot) =>
        !tags.some(
          (t: any) => t.name.toLowerCase() === ot.name.toLowerCase(),
        ),
    ),
  ]);

  function toggleCollection(col: any) {
    if (loading) return; // Bloquear interacción si está cargando
    if (selectedCollections.some((c) => c.id === col.id)) {
      selectedCollections = selectedCollections.filter((c) => c.id !== col.id);
    } else {
      selectedCollections = [...selectedCollections, col];
    }
  }

  function toggleTag(t: any) {
    if (loading) return; // Bloquear interacción si está cargando
    if (activeTags.some((at) => at.id === t.id)) {
      activeTags = activeTags.filter((at) => at.id !== t.id);
    } else {
      activeTags = [...activeTags, t];
    }
  }

  let mappedtags = $derived(
    allTags.map((tag) => ({
      ...tag,
      color: getTagColor(tag.name),
    })),
  );

  let loading = $state(false);
  let isEditing = $state(false);
  let url = $state("");
  let metadata = $state<any>(null);
  let isFetchingMetadata = $state(false);
  let isProcesing = $state(false);

  const clientCache = new Map();

  async function fetchMetadata(targetUrl: string) {
    if (!targetUrl || !targetUrl.startsWith("http")) return;
    if (clientCache.has(targetUrl)) {
      metadata = clientCache.get(targetUrl);
      return;
    }
    isFetchingMetadata = true;
    try {
      const res = await fetch(
        `/api/metadata?url=${encodeURIComponent(targetUrl)}`,
      );
      const data = await res.json();
      if (data && !data.error) {
        metadata = data;
        clientCache.set(targetUrl, data);
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
    } finally {
      isFetchingMetadata = false;
    }
  }

  $effect(() => {
    if (url.length < 10 || !url.startsWith("http")) {
      metadata = null;
      return;
    }
    const timeout = setTimeout(() => {
      fetchMetadata(url);
    }, 300);
    return () => clearTimeout(timeout);
  });

  function handlePaste(e: ClipboardEvent) {
    const pastedText = e.clipboardData?.getData("text");
    if (pastedText && pastedText.startsWith("http")) {
      fetchMetadata(pastedText);
    }
  }
</script>

<ModalContainer close={loading ? () => {} : closeForm}>
  <form
    method="POST"
    action="?/createLink"
    class="relative"
    use:enhance={({ action, cancel }) => {
      const isCreateTag = action.search.includes("createTag");
      loading = true;

      if (isCreateTag) {
        const newTagName = tag.trim();
        const existingTag = allTags.find(
          (t) => t.name.toLowerCase() === newTagName.toLowerCase(),
        );

        if (existingTag) {
          if (!activeTags.some((at) => at.id === existingTag.id)) {
            activeTags.push(existingTag);
          }
          tag = "";
          loading = false;
          cancel();
          return;
        }

        const newTempTag = { id: `temp-${Date.now()}`, name: newTagName };
        optimisticTags.push(newTempTag);
        activeTags.push(newTempTag);
        tag = "";
      } else {
        isProcesing = true;
      }

      return async ({ result, update }) => {
        if (result.type === "success" && !isCreateTag) {
          closeForm();
        }

        await update({ reset: false });

        if (result.type === "success" && isCreateTag) {
          const serverTag = result.data?.tag;
          if (serverTag) {
            // Sincronizar activeTags con el ID real del servidor
            activeTags = activeTags.map((at) =>
              at.id.toString().startsWith("temp-") &&
              at.name.toLowerCase() === serverTag.name.toLowerCase()
                ? serverTag
                : at,
            );
          }

          setTimeout(() => {
            optimisticTags = optimisticTags.filter(
              (ot) =>
                !tags.some(
                  (t: any) => t.name.toLowerCase() === ot.name.toLowerCase(),
                ),
            );
          }, 800);
        } else if (result.type !== "success" && isCreateTag) {
          // Si falló la creación del tag, eliminarlo de los activos y optimistas
          activeTags = activeTags.filter(
            (at) => !at.id.toString().startsWith("temp-"),
          );
          optimisticTags = optimisticTags.filter(
            (ot) => !ot.id.toString().startsWith("temp-"),
          );
        }
        loading = false;
      };
    }}
  >
    <!-- OVERLAY DE CARGA -->
    {#if isProcesing}
      <div
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-xl"
        transition:fade={{ duration: 200 }}
      >
        <div class="flex flex-col items-center gap-3">
          <IconLoader2 size={40} class="text-primary animate-spin" />
          <p class="text-sm font-bold tracking-tight text-foreground uppercase">
            Procesando...
          </p>
        </div>
      </div>
    {/if}

    {#each selectedCollections as collection}
      <input type="hidden" name="collections" value={collection.id} />
    {/each}
    {#each activeTags as tagObj}
      <input type="hidden" name="tags" value={tagObj.id} />
    {/each}

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
          name="url"
          bind:value={url}
          onpaste={handlePaste}
          placeholder="https://ejemplo.com/articulo"
          class="pl-8 pr-8 py-4.5 bg-background"
          disabled={loading}
        />
        {#if isFetchingMetadata}
          <div class="absolute right-3 flex items-center">
            <IconLoader2 size={16} class="text-primary animate-spin" />
          </div>
        {/if}
      </div>

      {#if metadata}
        <div
          class="relative p-4 border border-primary/20 bg-primary/5 rounded-xl my-4 flex flex-col gap-3 group transition-all hover:bg-primary/[0.08]"
          transition:scale={{ duration: 200, start: 0.98 }}
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0 w-full">
              <div
                class="h-10 w-10 shrink-0 rounded-lg bg-background border border-primary/20 flex items-center justify-center overflow-hidden p-1.5 shadow-sm"
              >
                <img
                  src={metadata.favicon}
                  alt=""
                  class="h-full w-full object-contain"
                  onerror={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.display =
                      "none")}
                />
              </div>
              <div class="flex flex-col min-w-0 w-full">
                {#if !isEditing}
                  <h3 class="text-sm font-bold text-foreground truncate">
                    {metadata.title}
                  </h3>
                  <input type="hidden" name="title" value={metadata.title} />
                {:else}
                  <Input
                    bind:value={metadata.title}
                    name="title"
                    class="h-7 text-sm font-bold py-1 px-2 -ml-2 bg-transparent border-primary/30"
                    disabled={loading}
                  />
                {/if}
                <p
                  class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5"
                >
                  {metadata.domain}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
              onclick={() => (isEditing = !isEditing)}
              disabled={loading}
            >
              {#if !isEditing}<IconEdit size={16} />{:else}<IconCheck
                  size={16}
                  class="text-emerald-500"
                />{/if}
            </button>
          </div>
          <div class="pt-2 border-t border-primary/10">
            {#if !isEditing}
              <p
                class="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 italic"
              >
                {metadata.description || "Sin descripción"}
              </p>
              <input
                type="hidden"
                name="description"
                value={metadata.description}
              />
            {:else}
              <Textarea
                bind:value={metadata.description}
                name="description"
                placeholder="Escribe una descripción..."
                class="text-[11px] leading-relaxed min-h-[60px] p-2 bg-transparent border-primary/30"
                disabled={loading}
              />
            {/if}
          </div>
          <input type="hidden" name="domain" value={metadata.domain} />
          <input type="hidden" name="faviconUrl" value={metadata.favicon} />
        </div>
      {/if}

      <div class="py-3">
        <p class="uppercase text-xs font-medium mb-2">Añadir a colección</p>
        {#if collectionLinks.length < 1}
          <p class="text-xs italic font-light text-muted-foreground py-2">
            No hay colecciones aún.
          </p>
        {:else}
          <div
            class="w-full border rounded-xl p-2.5 mb-4 bg-muted/30 flex gap-2 flex-wrap"
          >
            {#each collectionLinks as collection (collection.id)}
              {@const isActive = selectedCollections.some(
                (c) => c.id === collection.id,
              )}
              <button
                type="button"
                class="text-[11px] font-medium border rounded-lg py-1.5 px-3 flex items-center gap-1.5 transition-all {isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:border-primary/50'}"
                onclick={() => toggleCollection(collection)}
                disabled={loading}
              >
                {collection.name}
                {#if isActive}<div transition:scale={{ duration: 150 }}>
                    <IconCheck size={12} />
                  </div>{/if}
              </button>
            {/each}
          </div>
        {/if}

        <label for="tag" class="uppercase text-xs font-medium">Etiquetas</label>
        {#if mappedtags.length > 0}
          <div class="w-full rounded-xl p-2.5 mt-1 mb-4 flex gap-2 flex-wrap">
            {#each mappedtags as tagItem (tagItem.id)}
              {@const isActive = activeTags.some((at) => at.id === tagItem.id)}
              <button
                type="button"
                class="inline-flex items-center rounded-lg px-3 py-1 font-medium transition-all text-[11px] border {isActive
                  ? `${tagItem.color.bgActive} border-transparent text-secondary`
                  : `bg-background ${tagItem.color.text} ${tagItem.color.border}`}"
                onclick={() => toggleTag(tagItem)}
                disabled={loading}
              >
                {tagItem.name}
                {#if isActive}<div
                    transition:scale={{ duration: 150 }}
                    class="ml-1.5"
                  >
                    <IconCheck size={12} />
                  </div>{/if}
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
            name="tag"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={isInvalid || loading}
            formaction="?/createTag"
            class="transition-all duration-200 {isInvalid || loading
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
              : 'hover:bg-primary hover:text-white'}"
          >
            {#if loading && tag}
              <IconLoader2 size={14} class="animate-spin mr-1" />
            {/if}
            {loading ? "Añadiendo..." : "Añadir"}
          </Button>
        </div>
      </div>

      <div class="flex justify-end py-6 border-t border-border gap-3">
        <Button
          type="button"
          variant="ghost"
          onclick={closeForm}
          disabled={loading}>Cancelar</Button
        >
        <Button
  type="submit"
  disabled={loading || !metadata}
  class="px-8 flex flex-row transition-all duration-300
    disabled:bg-muted disabled:text-muted-foreground disabled:border-border 
    disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
>
  {#if isProcesing && !tag}
    <IconLoader2 size={16} class="animate-spin mr-2" />
  {/if}
  {isProcesing && !tag ? "Guardando..." : "Guardar link"}
</Button>
      </div>
    </div>
  </form>
</ModalContainer>
