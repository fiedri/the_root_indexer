<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from "svelte";
	import { uiState } from "$lib/state.svelte";

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

	onMount(() => {
		// Escuchamos si la app es instalable (PWA)
		window.addEventListener('beforeinstallprompt', (e) => {
			// Evitamos el prompt nativo
			e.preventDefault();
			// Lo guardamos para usarlo cuando queramos
			uiState.setInstallPrompt(e);
		});

		window.addEventListener('appinstalled', () => {
			// Limpiamos si ya se instaló
			uiState.setInstallPrompt(null);
		});
	});
	// const userId = session?.user.id;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
class="dark"
> 
  <div class="min-h-screen bg-background text-foreground font-mono">
    {@render children()}
  </div>
</div>

