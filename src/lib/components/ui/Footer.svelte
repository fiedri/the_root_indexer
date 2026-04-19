<script>
    import { IconLink, IconBrandGithub, IconBrandTwitter, IconHeart } from '@tabler/icons-svelte';
    const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-border/40 bg-secondary/20 backdrop-blur-sm py-12 px-6">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      
        <div class="flex flex-col items-center md:items-start gap-3">
            <div class="flex items-center gap-2">
                <div class="text-primary bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20">
                    <IconLink size={20} stroke={2.5}/>
                </div>
                <span class="text-sm font-black tracking-tighter uppercase">The ROOT Indexer</span>
            </div>
            <p class="text-xs text-muted-foreground font-medium text-center md:text-left leading-relaxed">
                Organiza y comparte tus recursos digitales con estilo.<br />
                © {currentYear} ROOT. Todos los derechos reservados.
            </p>
        </div>

        <div class="flex flex-col items-center md:items-end gap-4">
            <div class="flex gap-5">
                <a href="https://github.com/fiedri" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-all hover:scale-110" title="GitHub">
                    <IconBrandGithub size={22} />
                </a>
                <a href="https://x.com/friedrichruz" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-all hover:scale-110" title="X (Twitter)">
                    <IconBrandTwitter size={22} />
                </a>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Hecho con <IconHeart size={12} class="text-destructive fill-destructive" /> por 
                <span class="text-foreground">Friedrich Ruiz</span>
            </div>
        </div>

    </div>
</footer>