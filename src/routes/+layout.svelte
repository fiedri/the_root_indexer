<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import favicon from '$lib/assets/favicon.svg';

	let isdark = true;
	let { children, data } = $props() as { 
        children: any;
        data: LayoutData
    };

	let {supabase, session} = $derived(data)

	$effect(()=>{
		const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, newsession)=>{
			if(newsession?.expires_at !== session?.expires_at){
				invalidate('supabase:auth')
			}
		})
		return ()=> subscription.unsubscribe()
	})
	// const userId = session?.user.id;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="dark"> 
  <div class="min-h-screen bg-background text-foreground font-mono">
    {@render children()}
  </div>
</div>

