<script>
    import Hero from "$lib/components/ui/Hero.svelte";
    import Button from "$lib/components/ui/button/Button.svelte";

    import Footer from "$lib/components/ui/Footer.svelte";
    import Navbar from "$lib/components/ui/navbar.svelte";
    import { IconBolt,IconTag,IconSearch,IconFolderOpen, IconDevicesDown} from "@tabler/icons-svelte";
    let {data} = $props()
    let user = $derived(data.session?.user)
    let cards = [

        {
            icon: IconBolt,
            title: "Extraccion de metadata automatica",
            paragragh: "Pegue una URL y automáticamente se obtendra títulos y descripciones" 
        },{
            icon: IconTag,
            title: "Etiquetado Inteligente",
            paragragh: "Sistema de etiquetas con filtrado para encontrar lo que buscas."
        },
        {
            icon: IconSearch,
            title: "Busqueda intantanea",
            paragragh: "Búsqueda de texto completo en todos sus enlaces. Encuentra ese tutorial que guardaste hace meses en segundos."
        },{
            icon: IconFolderOpen,
            title: "Colecciones Compartibles",
            paragragh: "Agrupa tus enlaces en colecciones y compartelas con el mundo mediante enlaces publicos. Ideal para crear Roadmaps"
        },
        {
            icon: IconDevicesDown,
            title: "Instalable",
            paragragh: "Instala la aplicacion en tu telefono o escritorio para un acceso rapido y una experiencia nativa."
        }
    ]
</script>
<Navbar {user}/>
<Hero {user}/>
<section class="min-h-[80vh] bg-secondary py-20 px-6">
    <h2 class="text-center md:text-3xl text-2xl tracking-tight font-bold capitalize mb-8 leading-tight">Construido para desarrolladores.</h2>
    <div class="md:w-[70%] mx-auto flex flex-col">
        {#each cards as card }
            {@const Icon = card.icon}
            <div class="bg-card border rounded-2xl p-6 mb-8">
            <div class="text-primary bg-icon sm:p-2 rounded-xl p-1 w-auto inline-block" >
                <Icon size={24}/>
             </div>
            <h3 class="font-bold md:text-2xl text-xl my-2.5">{card.title}</h3>
            <p class="text-muted-foreground tracking-tight font-light text-md">{card.paragragh}
</p>
        </div>
        {/each}
    </div>
</section>
<section class="py-20 px-10 md:px-20 flex flex-col justify-center items-center">
    <div class="text-center mb-8">
        <h2 class="text-center md:text-3xl text-2xl tracking-tight font-bold capitalize mb-1 leading-tight">¿Listo para organizar tus conocimientos?</h2>
    <p class="text-muted-foreground tracking-tight font-light text-md">Únate a los desarrolladores que están construyendo su base de conocimientos personal.</p>
    </div>
    
    <a href={user? "/dashboard":"/auth/sign-up"} class="w-auto" data-sveltekit-preload-data="hover">
        <Button variant="primary">{user? "Ir a mi cuenta":"Crear cuenta"} &rarr;</Button>
    </a>
</section>
<Footer/>