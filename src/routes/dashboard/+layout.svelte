<script lang="ts">
    import Sidebar from "$lib/components/ui/sidebar.svelte";
    import { uiState } from "$lib/state.svelte";
    import { enhance } from "$app/forms";
    
    let { children, data } = $props();

    let lastResolvedData = $state<any>(null);
    let pendingDeletions = $state<string[]>([]);
    let deletionTimer: ReturnType<typeof setTimeout> | null = null;
    let deleteFormElement: HTMLFormElement | null = $state(null);

    let displayTags = $derived(
        (lastResolvedData?.tags || []).filter((t: any) => !uiState.isTagDeleted(t.id))
    );

    let displayCollections = $derived([
        ...(lastResolvedData?.collections || []),
        ...uiState.optimisticCollections
    ]);
$effect(() => {
    const currentPromise = data.streamed;
    currentPromise.then(resolved => {
        if (resolved && currentPromise === data.streamed) {
            lastResolvedData = resolved;

            // Actualizamos las etiquetas globales en el uiState
            if (resolved.tags) {
                uiState.setAllTags(resolved.tags);
            }

            if (pendingDeletions.length === 0) {
                uiState.clearDeletedTags();
            }
            }
        });
    });

    function handleRemoveTag(tagId: string) {
        uiState.markTagAsDeleted(tagId);
        pendingDeletions.push(tagId);
        if (deletionTimer) clearTimeout(deletionTimer);
        deletionTimer = setTimeout(() => {
            if (pendingDeletions.length > 0 && deleteFormElement) {
                deleteFormElement.requestSubmit();
            }
        }, 300);
    }

    function toggleOpenMenu() {
        uiState.toggleMenuSm();
    }
</script>

<form 
    bind:this={deleteFormElement}
    action="/dashboard?/deleteTags" 
    method="POST" 
    use:enhance={() => {
        return async ({ update }) => {
            await update({ invalidateAll: true });
            pendingDeletions = [];
        };
    }}
    class="hidden"
>
    {#each pendingDeletions as id}
        <input type="hidden" name="id" value={id} />
    {/each}
</form>

<div class="flex min-h-screen w-full bg-background">
    {#if !lastResolvedData}
        {#await data.streamed}
            <Sidebar 
                openMenuSm={uiState.openMenuSm} 
                {toggleOpenMenu} 
                linksLength={0} 
                tags={[]} 
                onremoveTag={handleRemoveTag}
                collections={[]}
            />
        {/await}
    {/if}

    {#if lastResolvedData}
        <Sidebar 
            openMenuSm={uiState.openMenuSm} 
            {toggleOpenMenu} 
            linksLength={lastResolvedData.links?.length || 0} 
            tags={displayTags} 
            onremoveTag={handleRemoveTag}
            collections={displayCollections}
        />
    {/if}

    <main class="flex w-full flex-col">
        {@render children()}
    </main>
</div>
