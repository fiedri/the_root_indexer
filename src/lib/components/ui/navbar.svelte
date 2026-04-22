<script>
    import { IconLink, IconUser} from '@tabler/icons-svelte';
    import Button from './button/Button.svelte';
    let {user}=$props()
</script>

<header class="max-w-7xl mx-auto w-full border-b border-border">
    <nav class="bg-background h-20 text-card-foreground sm:px-8 sm:py-6 px-2 flex items-center justify-between">
    <div class="flex items-center justify-center gap-1.5">
        <div class="text-primary bg-icon sm:p-2 rounded-xl p-1" ><IconLink size={20} stroke={2.5}/></div>
        <a class="sm:text-2xl font-bold text-sm" href="/">The ROOT Indexer</a>
    </div>
    <div class="flex md:gap-4 gap-2 font-bold">
      {#if !user}
      <a href="/auth/sign-in">
        <Button variant={"ghost"}>Iniciar sesión</Button>
      </a>
      <a href="/auth/sign-up">
        <Button variant={"primary"}>Comenzar</Button>
      </a>
      {:else}
      <a href="/dashboard" data-sveltekit-preload-data="hover">
        <Button variant={"primary"} class="flex flex-row items-center gap-2">Mi cuenta<IconUser size={16}/></Button>
      </a>
      {/if}
    </div>
</nav>
</header>
