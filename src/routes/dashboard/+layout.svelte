<script lang="ts">
    import type { LayoutData } from './$types';
    let {children: any, data: LayoutData} = $props();
</script>
<div class="flex min-h-screen w-full bg-background">
<aside 
    use:clickOutside={() => { if (openMenuSm) openMenuSm = false; }}
    class="fixed top-0 left-0 z-40 h-screen w-72 border-r border-border bg-card p-4 transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 
    {openMenuSm ? 'translate-x-0' : '-translate-x-full'}"
>
        <div class="flex h-full flex-col gap-6 text-muted-foreground">
            <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visión General</h3>
                <button onclick={toggleOpenMenu} class="text-muted-foreground transition-colors hover:text-foreground lg:hidden">
                    <IconX size={18}/>
                </button>
            </div>

            <div class="flex flex-col gap-1">
                <Button variant="primary" class="flex w-full items-center justify-between">
                    <span class="flex items-center gap-2"><IconFolder size={18}/> Todos</span>
                    <span class="rounded-lg border border-primary-foreground/20 px-2 py-0.5 text-xs">{links.length}</span>
                </Button>
                <Button variant="ghost" class="flex w-full items-center justify-between hover:bg-accent hover:text-foreground">
                    <span class="flex items-center gap-2"><IconFolder size={18}/> Recientes</span>
                    <span class="rounded-lg border border-border px-2 py-0.5 text-xs">0</span>
                </Button>
            </div>

            <div class="shrink-0">
                <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex"><IconStackMiddle size={16} class="mr-2"/>Colecciones</h3>
                {#if collections.length < 1}
                    <p class="px-3 py-2 text-xs italic opacity-70">Sin colecciones aún.</p>
                {:else}
                    <nav class="flex flex-col gap-1">
                        {#each collections as collection }
                            <CollectionCard {...collection}/>
                        {/each}
                    </nav>
                {/if}
            </div>

            <div class="flex min-h-0 flex-1 flex-col">
                <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"># Etiquetas</h3>
                <nav class="flex-1 overflow-y-auto pr-2 space-y-0.5">
                {#if tags.length < 1}
                <p class="px-3 py-2 text-xs italic opacity-70">Sin etiquetas aún.</p>
                {/if}
                {#each tags as tag }
                    <Tag tagInfo={tag} onremove='asdfasd'/>
                {/each}
                </nav>
            </div>
        </div>
    </aside>
{@render children()}
 </div>
