<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/Button.svelte';
  import { IconAlertTriangle, IconHome, IconArrowLeft } from '@tabler/icons-svelte';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
  <div class="mb-6 rounded-full bg-destructive/10 p-6 text-destructive">
    <IconAlertTriangle size={64} stroke={1.5} />
  </div>

  <h1 class="text-4xl font-black tracking-tighter sm:text-6xl mb-2">
    {page.status}
  </h1>
  
  <p class="text-xl font-medium text-foreground mb-8 max-w-md">
    {page.error?.message || 'Algo salió mal en el servidor, pero no te preocupes, no es tu culpa.'}
  </p>

  <div class="flex flex-col sm:flex-row gap-4">
    <button 
      onclick={() => history.back()}
      class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors font-bold text-sm"
    >
      <IconArrowLeft size={18} />
      Volver atrás
    </button>
    
    <a href="/">
      <Button variant="primary" class="flex items-center gap-2 px-8 py-3">
        <IconHome size={18} />
        Ir al inicio
      </Button>
    </a>
  </div>

  <div class="mt-12 text-muted-foreground/40 text-[10px] uppercase tracking-widest font-bold">
    ROOT Indexer &bull; Error System
  </div>
</div>