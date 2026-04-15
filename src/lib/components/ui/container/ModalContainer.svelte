<script lang="ts">
import { type Snippet } from 'svelte';
  import { IconX } from "@tabler/icons-svelte";
  import { blur } from 'svelte/transition';
 
  interface Props {
    children?: Snippet;
    close: ()=> void;
  }
  let { children, close }: Props = $props();
</script>


<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-background/30 backdrop-blur-sm px-4"
onclick={close}
transition:blur={{ duration: 200, delay: 50 }}
>
  <div
    class="relative w-full max-w-lg border border-border bg-background shadow-xl rounded-2xl overflow-hidden"

onclick={(e) => e.stopPropagation()}
  >
  <button onclick={close}  class="text-muted-foreground transition-colors hover:text-foreground absolute top-3.5 right-5">
                    <IconX size={18}/>
  </button>
    {@render children?.()}
  </div>
</div>