<script lang="ts">
    import { IconLink, IconFolderOpen, IconShare, IconBrandGithub, IconBrandTwitter, IconHeart, IconMoodConfuzed } from "@tabler/icons-svelte";
    import SearchInput from "$lib/components/ui/input/search-input.svelte";
    import LinkCard from "$lib/components/ui/linkCard.svelte";
    import { cn } from "$lib/utils";

    let { data } = $props();
    
    let searchQuery = $state("");
    const currentYear = new Date().getFullYear();
</script>

<div class="min-h-screen flex flex-col bg-background selection:bg-primary/20">
    <!-- Header: Siempre visible al instante -->
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <IconLink class="text-primary w-5 h-5" />
                </div>
                <div class="flex flex-col">
                    <h1 class="text-base font-bold tracking-tight leading-none">The ROOT Indexer</h1>
                    <span class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Colección Pública</span>
                </div>
            </div>
            
            <a href="/" class="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                Ir a la App Principal
                <IconShare size={14} />
            </a>
        </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        {#await data.streamed}
            <!-- SKELETON STATE: Instantáneo -->
            <div class="w-full max-w-4xl text-center mb-12 animate-pulse">
                <div class="h-12 w-3/4 bg-muted rounded-2xl mx-auto mb-6"></div>
                <div class="h-4 w-1/2 bg-muted rounded mx-auto mb-2"></div>
                <div class="h-4 w-1/3 bg-muted rounded mx-auto"></div>
            </div>

            <div class="w-full max-w-3xl space-y-8">
                <div class="h-14 w-full bg-muted rounded-xl animate-pulse"></div>
                <div class="space-y-4">
                    {#each Array(4) as _}
                        <div class="h-24 w-full bg-muted rounded-xl animate-pulse"></div>
                    {/each}
                </div>
            </div>
        {:then collection}
            {#if !collection}
                <div class="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                    <div class="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                        <IconMoodConfuzed size={40} class="text-destructive" />
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Colección no encontrada</h3>
                    <p class="text-muted-foreground max-w-xs mx-auto">
                        Es posible que la colección sea privada o el enlace haya expirado.
                    </p>
                    <a href="/" class="mt-8 text-primary font-bold hover:underline">Volver al inicio</a>
                </div>
            {:else}
                {@const filteredLinks = collection.links.filter(link => 
                    link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )}

                <div class="w-full max-w-4xl text-center mb-12">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-balance leading-tight mb-6">
                        {collection.name}
                    </h2>
                    {#if collection.description}
                        <p class="text-lg text-muted-foreground/80 leading-relaxed text-pretty font-medium max-w-2xl mx-auto">
                            {collection.description}
                        </p>
                    {/if}
                </div>

                <div class="w-full max-w-3xl space-y-8">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div class="relative">
                            <SearchInput 
                                bind:value={searchQuery}
                                placeholder="Busca por título, descripción o URL..." 
                                class="h-14 text-base shadow-sm rounded-xl border-border/60 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div class="space-y-4">
                        {#if filteredLinks.length < 1}
                            <div class="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                                <div class="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                                    <IconFolderOpen size={40} class="text-muted-foreground/50" />
                                </div>
                                <h3 class="text-xl font-bold mb-2">No se encontraron enlaces</h3>
                                <p class="text-muted-foreground text-sm max-w-xs mx-auto">
                                    No hay resultados para "{searchQuery}".
                                </p>
                            </div>
                        {:else}
                            <div class="grid gap-4">
                                {#each filteredLinks as link (link.id)}
                                    <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <LinkCard 
                                            id={link.id}
                                            title={link.title} 
                                            domain={link.domain || ''} 
                                            favicon_url={link.faviconUrl || ''} 
                                            description={link.description || ''}
                                            tags={[]} 
                                            url={link.url}
                                        />
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        {/await}
    </main>

    <!-- Footer: Siempre visible -->
    <footer class="mt-auto border-t border-border/40 bg-secondary/20 backdrop-blur-sm py-12">
        <div class="container mx-auto px-4 text-center">
            <div class="flex flex-col items-center gap-4">
                <div class="flex items-center gap-2">
                    <IconLink class="text-primary w-5 h-5" />
                    <span class="text-sm font-black tracking-tighter uppercase">The ROOT Indexer</span>
                </div>
                <div class="flex gap-5">
                    <a href="https://github.com/fiedri" target="_blank" class="text-muted-foreground hover:text-primary transition-all"><IconBrandGithub size={22} /></a>
                    <a href="https://x.com/friedrichruz" target="_blank" class="text-muted-foreground hover:text-primary transition-all"><IconBrandTwitter size={22} /></a>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Hecho con <IconHeart size={12} class="text-destructive fill-destructive inline" /> por Friedrich Ruiz
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    :global(.animate-in) {
        animation-fill-mode: forwards;
    }
</style>
