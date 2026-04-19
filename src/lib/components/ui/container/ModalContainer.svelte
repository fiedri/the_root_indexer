<script lang="ts">
  import { type Snippet } from 'svelte';
  import { IconX } from "@tabler/icons-svelte";
  import { blur } from 'svelte/transition';

  interface Props {
    children?: Snippet;
    close: () => void;
  }

  let { children, close }: Props = $props();
  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    dialog?.showModal();
  });

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialog) close();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={close}
  onclick={handleBackdropClick}
  class="m-auto w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-2xl border border-border bg-background p-0 shadow-xl backdrop:bg-background/30 backdrop:backdrop-blur-sm focus:outline-none
  text-foreground"
>
  <div 
    transition:blur={{ duration: 200, delay: 50 }} 
    class="relative"
  >
    <button
      onclick={close}
      class="absolute right-5 top-3.5 z-50 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Cerrar modal"
    >
      <IconX size={18} />
    </button>
    {@render children?.()}
  </div>
</dialog>

<style>
  /* Neutralizamos estilos base del dialog que ensucian el diseño */
  dialog {
    display: block;
    position: fixed;
    inset: 0;
    /* Estilos para un scrollbar más bonito y minimalista */
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
  }

  /* Personalización del scrollbar para navegadores Webkit (Chrome, Safari, Edge) */
  dialog::-webkit-scrollbar {
    width: 6px;
  }

  dialog::-webkit-scrollbar-track {
    background: transparent;
  }

  dialog::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.2);
    border-radius: 20px;
    border: 2px solid transparent; /* Crea un efecto de padding */
  }

  dialog::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.4);
  }

  dialog:not([open]) {
    display: none;
  }

  dialog::backdrop {
    animation: fade-in 0.2s ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  :global(body:has(dialog[open])) {
    overflow: hidden;
  }
</style>