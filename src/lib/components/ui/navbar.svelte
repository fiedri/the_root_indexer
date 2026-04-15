<script>
    import { IconLink} from '@tabler/icons-svelte';
    import Button from './button/Button.svelte';
</script>

<div class="max-w-7xl mx-auto w-full border-b border-border">
    <nav class="bg-background h-20 text-card-foreground sm:px-8 sm:py-6 px-2 flex items-center justify-between">
    <div class="flex items-center justify-center gap-1.5">
        <div class="text-primary bg-icon sm:p-2 rounded-xl p-1" ><IconLink size={20} stroke={2.5}/></div>
        <span class="sm:text-2xl font-bold text-sm">The ROOT Indexer</span>
    </div>
    <div class="flex md:gap-4 gap-2 font-bold">
        <!-- <button class="hover:bg-primary sm:px-3 sm:py-2 transition-colors text-muted-foreground hover:text-primary-foreground rounded-md">Sign In</button>
        <button class="bg-primary text-primary-foreground hover:bg-primary/90
     sm:px-3 sm:py-2 rounded-md transition-colors">Get Started</button> -->
      <a href="/auth/sign-in">
        <Button variant={"ghost"}>Log in</Button>
      </a>
     <Button variant={"primary"}>Get Started</Button>
    </div>
</nav>
</div>
