<script lang="ts">
    import { blur } from "svelte/transition";
    import type { PageProps } from "../$types";
    import Button from "$lib/components/ui/button/Button.svelte";
    import LinkCard from "$lib/components/ui/linkCard.svelte";
        import CollectionCard from "$lib/components/ui/collectionCard.svelte";
    import { IconLink, IconFolderPlus, IconMenu2, IconUser, IconFolderOpen, IconX, IconFolder, IconDoorExit, IconUserX,
        IconStackMiddle
    } from "@tabler/icons-svelte";
    import SearchInput from "$lib/components/ui/input/search-input.svelte";
    import { clickOutside } from "$lib/utils/clickOutside";
    import Tag from "$lib/components/ui/tags/Tag.svelte";
    import AddLinkForm from "$lib/components/ui/AddLinkForm.svelte";
    import CreateCollectionForm from "$lib/components/ui/CreateCollectionForm.svelte";
  
    let openMenuSm = $state(false);
    let openLinkform = $state(false);
    let createCollection = $state(false);
    let openOptions = $state(false);
    let openCountOptions = $state(false);
    function createCollectionToggle(){
        createCollection = !createCollection
    }
    function toggleOpenMenu() {
        openMenuSm = !openMenuSm;
    }
    
    function toggleForm() {
        openLinkform = !openLinkform;
    }
    
    
    
    let {data} = $props() as PageProps;
    let {tags, collections, links} = $derived(data);
    
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

    <main class="flex w-full flex-col" >
        <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
            <div class="flex items-center gap-3">
                <Button variant="ghost" class="p-2 lg:hidden" onclick={toggleOpenMenu}>
                    <IconMenu2 size={20}/>
                </Button>
                <span class="flex items-center gap-2 text-lg font-bold tracking-tight">
                    <div class="rounded-xl bg-primary/10 p-2 text-primary">
                        <IconLink size={20} stroke={2.5}/>
                    </div>
                    <span class="inline text-sm sm:text-2xl">The ROOT Indexer</span>
                </span>
            </div>

            <div class="flex items-center gap-2 sm:gap-4 ">
                <Button variant="ghost" class="hidden border border-border font-medium md:flex items-center gap-2" onclick={createCollectionToggle}>
                    <IconFolderPlus size={18}/> Nueva Colección
                </Button>
                <Button variant="primary" class="hidden md:flex items-center gap-2 font-medium" onclick={toggleForm}>
                    + Añadir Link
                </Button>
                <Button variant="primary" class="md:hidden flex items-center gap-2 font-medium" onclick={()=> {openOptions = true}}>
                    +
                </Button>
                
                <Button variant="ghost" class="rounded-full p-2" onclick={()=>{openCountOptions=true}}>
                    <IconUser size={18}/>
                </Button>
            </div>
            
        </header>

        <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-auto">
            <div class="flex flex-col gap-6">
                <SearchInput placeholder="Busca por nombre o URL..."/>
                {#if links.length < 1}
                
                <div class="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/40 text-center">
                    <div class="rounded-full bg-muted opacity-50">
                        <IconFolderOpen size={48} class="text-muted-foreground"/>
                    </div>
                    <div>
                        <p class="text-base font-semibold text-foreground">Tu librería está vacía</p>
                        <p class="text-sm text-muted-foreground">Empieza añadiendo tus enlaces favoritos.</p>
                    </div>
                </div>
                {:else}
                {#if tags.length > 1}
                <div class="flex flex-wrap gap-2" id="tags_container">
                    {#each tags as tag }
                        <Tag tagInfo={tag} isActive={false} onclick="asdfsd"/>
                    {/each}
                </div>
                {/if}
                <span class="uppercase text-muted-foreground text-xs ml-3 font-semibold">{links.length} link{links.length <1 ? "": "s"}</span>
                <div class="flex flex-col gap-6">
                    {#each links as link }
                        <LinkCard {...link} />
                    {/each}
                </div>
                {/if}
            </div>
        </div>

        {#if openLinkform}

            
                <AddLinkForm closeForm={toggleForm} collectionLinks={collections} {tags}/>
            

        {/if}
        {#if createCollection}
        <CreateCollectionForm close={createCollectionToggle}/>
        {/if}
    </main>

    {#if openOptions}
        <button aria-hidden="true"
        class="fixed inset-0 z-20 bg-transparent cursor-default" 
        onclick={() => openOptions = false}
    ></button>
    <div class="fixed top-14 right-15 z-30 w-auto h-auto bg-secondary transition-all p-1 border border-border rounded md:hidden"
    transition:blur={{ duration: 200 }}
>
                <Button variant='ghost' class="w-full text-left" onclick={()=>{toggleForm(); openOptions= false}}>+ Agregar link</Button>
                <Button variant="ghost" class="flex flex-row gap-1" onclick={()=>{createCollectionToggle(); openOptions=false}}>
                    <IconFolderPlus size={18}/> Nueva Colección
                </Button>
            </div>
    {/if}
    {#if openCountOptions}
    <button aria-hidden="true"
        class="fixed inset-0 z-20 bg-transparent cursor-default" 
        onclick={() => openCountOptions = false}
    ></button>
    <div class="fixed top-14 right-3.5 z-30 w-60 h-auto bg-card transition-all p-1 border border-border rounded font-ligth"
    transition:blur={{ duration: 200 }}
>
<div class="py-2 px-3">
    <p class="text-sm">Sesión iniciada como</p>
    <p class="text-xs text-muted-foreground font-light">example@gmail.com</p>
</div>
<div class="bg-border -mx-1 my-1 h-px"></div>
    <Button variant='ghost' class="w-full text-left flex items-center gap-1 hover:bg-primary/30 hover:text-black" onclick={()=>{toggleForm(); openOptions= false}}>
        <IconDoorExit size={18} class="text-muted-foreground"/>Cerrar sesión</Button>
 <div class="bg-border -mx-1 my-1 h-px"></div>
                <Button variant="ghost" class="flex flex-row gap-1 text-destructive w-full hover:bg-destructive/30 hover:text-destructive" onclick={()=>{createCollectionToggle(); openOptions=false}}>
                    <IconUserX size={18} class="text-muted-foreground"/> Borrar Cuenta
                </Button>
            </div>
    {/if}
         
</div>