<script lang="ts">
    import AccountOptions from "$lib/components/ui/accountOptions.svelte";
    import { blur } from "svelte/transition";
    import type { PageProps } from "../$types";
    import Button from "$lib/components/ui/button/Button.svelte";
    import LinkCard from "$lib/components/ui/linkCard.svelte";
    import { IconLink, IconFolderPlus, IconMenu2, IconUser, IconFolderOpen, IconExternalLink, IconWorld, IconShare, IconCheck } from "@tabler/icons-svelte";
    import SearchInput from "$lib/components/ui/input/search-input.svelte";
    import Tag from "$lib/components/ui/tags/Tag.svelte";
    import AddLinkForm from "$lib/components/ui/AddLinkForm.svelte";
    import CreateCollectionForm from "$lib/components/ui/CreateCollectionForm.svelte";
    import EditCollectionForm from "$lib/components/ui/EditCollectionForm.svelte";
    import { uiState } from "$lib/state.svelte";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let { data } = $props() as PageProps;
    
    // ESTADO DE FILTRADO
    let selectedCollectionId = $derived(page.url.searchParams.get('c'));

    // Renderizado Progresivo
    let displayLimit = $state(20);

    let openLinkform = $state(false);
    let createCollection = $state(false);
    let openOptions = $state(false);
    let openAccountOptions = $state(false);

    // Guardamos los datos resueltos en un estado persistente
    let lastResolvedData = $state<any>(null);
    
    // Borrado de links optimista
    let pendingLinkDeletions = $state<string[]>([]);
    let linkDeletionTimer: ReturnType<typeof setTimeout> | null = null;
    let deleteFormElementLinks: HTMLFormElement | null = $state(null);

    $effect(() => {
        const currentPromise = data.streamed;
        currentPromise.then(result => {
            if (result && currentPromise === data.streamed) {
                lastResolvedData = result;
                // Si no hay borrados de links en cola, limpiamos el estado optimista de links
                if (pendingLinkDeletions.length === 0) {
                    uiState.clearDeletedLinks();
                }
            } else if (!result && currentPromise === data.streamed) {
                goto('/auth/sign-in');
            }
        });
    });

    onMount(() => {
        setTimeout(() => {
            displayLimit = 1000; 
        }, 100);
    });

    function handleRemoveLink(linkId: string) {
        // 1. Marcamos en el estado global (instantáneo)
        uiState.markLinkAsDeleted(linkId);
        pendingLinkDeletions.push(linkId);

        // 2. Debounce
        if (linkDeletionTimer) clearTimeout(linkDeletionTimer);
        linkDeletionTimer = setTimeout(() => {
            if (pendingLinkDeletions.length > 0 && deleteFormElementLinks) {
                deleteFormElementLinks.requestSubmit();
            }
        }, 300);
    }

    function createCollectionToggle() { createCollection = !createCollection; }
    function toggleForm() { openLinkform = !openLinkform; }
    function closeAccountOptions() { openAccountOptions = false; }
    
    let isCopied = $state(false);
    let currentUrl = $state(page.url.origin);
    async function copyToClipboard(collectionId: string) {
        try {
            await navigator.clipboard.writeText(`${currentUrl}/share/collection/${collectionId}`);
            isCopied = true;
            setTimeout(() => (isCopied = false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }
</script>

{#await data.streamed}
    {#if !lastResolvedData}
        <!-- SKELETON SOLO LA PRIMERA VEZ -->
        <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
            <div class="flex items-center gap-3 animate-pulse">
                <div class="h-10 w-10 bg-muted rounded-xl"></div>
                <div class="h-6 w-32 bg-muted rounded"></div>
            </div>
        </header>
        <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-auto">
            <div class="flex flex-col gap-6 animate-pulse">
                <div class="h-12 w-full bg-muted rounded-xl mb-4"></div>
                {#each Array(5) as _}
                    <div class="h-32 w-full bg-muted rounded-xl"></div>
                {/each}
            </div>
        </div>
    {/if}
{/await}

{#if lastResolvedData}
    {@const { tags: resolvedTags, collections: resolvedCollections, links: resolvedLinks, relations: resolvedRelations, user } = lastResolvedData}
    {@const selectedCollection = resolvedCollections?.find((c: any) => c.id === selectedCollectionId)}
    
    <!-- Filtramos colecciones de links -->
    {@const collectionLinksIds = selectedCollectionId 
        ? resolvedRelations?.filter((r: any) => r.collectionId === selectedCollectionId).map((r: any) => r.linkId) ?? []
        : null}
    
    <!-- APLICAMOS FILTRO OPTIMISTA DE LINKS Y FILTRADO POR TAGS (ESTRICTO) -->
    {@const allFilteredLinks = (collectionLinksIds 
        ? resolvedLinks?.filter((l: any) => collectionLinksIds.includes(l.id)) ?? []
        : resolvedLinks ?? []
    ).filter((l: any) => {
        // Filtro de borrado optimista
        if (uiState.isLinkDeleted(l.id)) return false;

        // Filtro de Etiquetas Estricto (AND)
        if (uiState.activeFilterTags.size > 0) {
            const linkTagIds = l.tags?.map((t: any) => t.id) || [];
            return Array.from(uiState.activeFilterTags).every(tagId => linkTagIds.includes(tagId));
        }

        return true;
    })}
    
    {@const pagedLinks = allFilteredLinks.slice(0, displayLimit)}

    <form action="/dashboard?/deletelinks" method="POST" class="hidden"
        bind:this={deleteFormElementLinks}
        use:enhance={() => {
            return async ({ update }) => {
                await update({ invalidateAll: true });
                pendingLinkDeletions = [];
            };
        }}
    >
        {#each pendingLinkDeletions as id}
            <input type="hidden" name="id" value={id} />
        {/each}
    </form>

    <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
        <div class="flex items-center gap-0.5">
            <Button variant="ghost" class="px-1.5 lg:hidden" onclick={() => uiState.toggleMenuSm()}>
                <IconMenu2 size={20}/>
            </Button>
            <span class="flex items-center gap-2 text-lg font-bold tracking-tight">
                <div class="rounded-xl bg-primary/10 p-1.5 text-primary sm:p-2">
                    <IconLink size={20} stroke={2.5}/>
                </div>
                {#if !selectedCollection}
                <span class="inline text-sm sm:text-2xl">The ROOT Indexer</span>
                {:else}
                <div>
                    {#if selectedCollection?.isPublic}
                    <span class="flex flex-row items-center gap-1 justify-center text-xs border border-primary w-19 rounded bg-primary/10"><IconWorld size={12}/>Publica</span>
                    {/if}
                    <span class="text-sm sm:text-[18px]">{selectedCollection?.name}</span>
                </div>
                {/if}
            </span>
        </div>

        <div class="flex items-center gap-2 sm:gap-4 ">
            {#if selectedCollection?.isPublic}
            <Button variant="outline" class="flex flex-row justify-center items-center px-1 py-1.5 gap-1 border-primary/70 border text-primary/90 hover:bg-primary/10" onclick={()=> copyToClipboard(selectedCollectionId)}>
                {#if isCopied}
                <IconCheck size={14}/>
                {:else}
                <IconShare size={14}/>
                {/if}
                <span class="hidden lg:inline">Compartir</span>
            </Button>
            {/if}
            <Button variant="ghost" class="hidden border border-border font-medium md:flex items-center gap-2" onclick={createCollectionToggle}>
                <IconFolderPlus size={18}/> Nueva Colección
            </Button>
            <Button variant="primary" class="hidden md:flex items-center gap-2 font-medium" onclick={toggleForm}>
                + Añadir Link
            </Button>
            <Button variant="primary" class="md:hidden flex items-center gap-2 font-medium" onclick={()=> {openOptions = true}}>
                +
            </Button>
            <Button variant="ghost" class="rounded-full p-2" onclick={()=>{openAccountOptions=true}}>
                <IconUser size={18}/>
            </Button>
        </div>
    </header>

    <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-auto">
        <div class="flex flex-col gap-6">
            <SearchInput placeholder="Busca en {selectedCollection ? selectedCollection.name : 'todos tus links'}..."/>
            
            {#if allFilteredLinks.length < 1 && uiState.activeFilterTags.size === 0}
                <div class="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/40 text-center">
                    <div class="rounded-full bg-muted opacity-50">
                        <IconFolderOpen size={48} class="text-muted-foreground"/>
                    </div>
                    <div>
                        <p class="text-base font-semibold text-foreground">
                            {selectedCollectionId ? 'Esta colección está vacía' : 'Tu librería está vacía'}
                        </p>
                        <p class="text-sm text-muted-foreground">Empieza añadiendo tus enlaces favoritos.</p>
                    </div>
                </div>
            {:else}
                <div class="space-y-4">
                    {#if resolvedTags.length >= 1}
                        <div class="flex flex-wrap items-center gap-2" id="tags_container">
                            {#each resolvedTags.filter(t => !uiState.isTagDeleted(t.id)) as tag }
                                <Tag 
                                    tagInfo={tag} 
                                    isActive={uiState.isTagFilterActive(tag.id)} 
                                    onclick={() => uiState.toggleFilterTag(tag.id)}
                                />
                            {/each}
                            
                            {#if uiState.activeFilterTags.size > 0}
                                <button 
                                    onclick={() => uiState.clearFilterTags()}
                                    class="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline ml-2"
                                >
                                    Limpiar Filtros
                                </button>
                            {/if}
                        </div>
                    {/if}

                    {#if allFilteredLinks.length < 1 && uiState.activeFilterTags.size > 0}
                         <div class="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card/40 text-center">
                            <p class="text-sm font-medium text-muted-foreground">No hay links con todas estas etiquetas.</p>
                            <button onclick={() => uiState.clearFilterTags()} class="text-xs text-primary underline">Mostrar todos</button>
                         </div>
                    {/if}
                </div>
                <div class="uppercase text-muted-foreground text-xs font-semibold flex flex-row justify-between">
                    <span>
                        {allFilteredLinks.length} link{allFilteredLinks.length === 1 ? "" : "s"}
                        {selectedCollection ? `en ${selectedCollection.name}` : ''}
                    </span>
                    {#if selectedCollection?.isPublic}
                    <a href="share/collection/{selectedCollectionId}" class="flex flex-row gap-1 text-primary hover:underline capitalize" data-sveltekit-preload-data="hover" target="_blank">Pagina Publica<IconExternalLink size={14}/></a>
                    {/if}
                </div>
                
                <div class="flex flex-col gap-6">
                    {#each pagedLinks as link (link.id)}
                        <div in:blur>
                            <LinkCard {...link} favicon_url={link.faviconUrl} onDelete={handleRemoveLink}/>
                        </div>
                    {/each}
                    {#if displayLimit < allFilteredLinks.length}
                        <div class="p-8 text-center text-muted-foreground italic">Cargando más links...</div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    {#if openLinkform}
        <AddLinkForm closeForm={toggleForm} collectionLinks={resolvedCollections} tags={resolvedTags}/>
    {/if}

    {#if createCollection}
        <CreateCollectionForm close={createCollectionToggle} allLinks={resolvedLinks} tags={resolvedTags}/>
    {/if}

    {#if uiState.editingCollection}
        <EditCollectionForm 
            close={() => uiState.clearEditingCollection()} 
            allLinks={resolvedLinks} 
            tags={resolvedTags}
            relations={resolvedRelations}
        />
    {/if}
    
    {#if openAccountOptions}
        <AccountOptions onremove={closeAccountOptions} user={user.email}/>
    {/if}
{/if}

{#if openOptions}
    <button aria-hidden="true" class="fixed inset-0 z-20 bg-transparent cursor-default" onclick={() => openOptions = false}></button>
    <div class="fixed top-14 right-15 z-30 w-auto h-auto bg-secondary transition-all p-1 border border-border rounded md:hidden" transition:blur={{ duration: 200 }}>
        <Button variant='ghost' class="w-full text-left" onclick={()=>{toggleForm(); openOptions= false}}>+ Agregar link</Button>
        <Button variant="ghost" class="flex flex-row gap-1" onclick={()=>{createCollectionToggle(); openOptions=false}}>
            <IconFolderPlus size={18}/> Nueva Colección
        </Button>
    </div>
{/if}
