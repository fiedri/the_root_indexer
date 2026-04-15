<script>
    import { IconLink} from '@tabler/icons-svelte';
    const fecha = new Date()
</script>
<footer class="border-t border-border bg-background py-12 px-6">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row
      justify-between items-center gap-8">
      
      <div class="flex items-center gap-1.5">
          <div class="text-primary bg-primary/10 p-2 rounded-xl" ><IconLink size={20} stroke={2.5}/></div>
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground font-medium">The ROOT Indexer</span>
            <span class="text-xs text-muted-foreground font-medium">© {fecha.getFullYear()} Todos los derechos reservados</span>
   
          </div>

        </div>
      <div class="flex flex-col items-center md:items-end gap-2">
                <p class="text-sm text-muted-foreground font-medium
      text-center md:text-right max-w-40 md:max-w-none">Construido con <span class="text-destructive
      animate-pulse text-center">❤️</span> para programadores, por programadores.
                </p>
                
                <!-- POner enlaces aqui -->
                <div class="flex gap-4 mt-2">
                    <!-- Por ahora solo un ejemplo de texto secundario (github o x) -->
                    <span class="text-xs
      text-muted-foreground/60">v0.1.0-alpha</span>
                </div>
            </div>

    </div>
</footer>