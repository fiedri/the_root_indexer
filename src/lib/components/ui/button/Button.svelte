<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { clsx, type ClassValue } from 'clsx';
    import { twMerge } from 'tailwind-merge';

    function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    interface Props extends HTMLButtonAttributes {
        variant?: 'primary' | 'ghost' | 'outline',
        children: Snippet
    }
  let { variant='primary', children, class: className, ...rest }: Props = $props();
  const baseClasses = "text-sm px-4 py-2 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-primary hover:text-primary-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  };
</script>
<button 
   class="{cn(baseClasses, variants[variant], className)}" 
   {...rest}
 >
   {@render children?.()}
 </button>