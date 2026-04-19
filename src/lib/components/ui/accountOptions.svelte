<script>
import { enhance } from "$app/forms";
import Button from "./button/Button.svelte";
import { blur } from "svelte/transition";
import ModalContainer from "./container/ModalContainer.svelte";
import { IconUserX, IconDoorExit, IconDeviceMobileDown } from "@tabler/icons-svelte";
import { uiState } from "$lib/state.svelte";

    let {onremove, user} = $props()
    let isLoadingLogout = $state(false)
    let isLoadingDelete = $state(false)
    let showConfirmDialog = $state(false)

    async function handleInstall() {
        if (!uiState.installPrompt) return;
        
        // Lanzamos el prompt del navegador
        uiState.installPrompt.prompt();
        
        // Esperamos el resultado
        const { outcome } = await uiState.installPrompt.userChoice;
        if (outcome === 'accepted') {
            uiState.setInstallPrompt(null);
            onremove(); // Cerramos el menú
        }
    }
</script>

<button 
    type="button" 
    class="fixed inset-0 z-20 bg-transparent cursor-default" 
    onclick={onremove}
    aria-label="Cerrar opciones de cuenta"
></button>
    <div class="fixed top-14 right-3.5 z-30 w-60 h-auto bg-card transition-all p-1 border border-border rounded font-light" transition:blur={{ duration: 200 }}>
        {#if uiState.installPrompt}
            <Button variant="ghost" class="w-full text-left flex items-center gap-1 text-primary hover:bg-primary/10" onclick={handleInstall}>
                <IconDeviceMobileDown size={18} /> Instalar aplicación
            </Button>
            <div class="bg-border -mx-1 my-1 h-px"></div>
        {/if}

        <form method="POST" action="?/logout"
        use:enhance={() => {
                isLoadingLogout = true;
                return async ({ update }) => {
                    await update();
                    isLoadingLogout = false;
                };
            }}>
            <div class="py-2 px-3">
            <p class="text-sm">Sesión iniciada como</p>
            <p class="text-xs text-muted-foreground font-light truncate">{user}</p>
        </div>
        <div class="bg-border -mx-1 my-1 h-px"></div>
        <Button variant='ghost' class="w-full text-left flex items-center gap-1 hover:bg-primary/30 hover:text-black" type="submit">
            <IconDoorExit size={18} class="text-muted-foreground"/>{isLoadingLogout ? "Cerrando...": "Cerrar sesión"}
            {#if isLoadingLogout}
            <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {/if}
        </Button>
        <div class="bg-border -mx-1 my-1 h-px"></div>
        <Button variant="ghost" type="button" class="flex flex-row gap-1 text-destructive w-full hover:bg-destructive/30 hover:text-destructive"
        onclick={()=> showConfirmDialog = true}>
            <IconUserX size={18} class="text-muted-foreground"/> Borrar Cuenta
        </Button>
        </form>
    </div>

{#if showConfirmDialog}
<ModalContainer close={()=>showConfirmDialog = false}>
    <form action="?/deleteAccount" method="POST" class="p-8" use:enhance={() => {
        isLoadingDelete = true;
        return async ({ update }) => {
            await update();
            // El redirect se encargará de sacarnos de acá
        };
    }}>
        <h2 class="text-xl font-bold my-2">¿Estás seguro?</h2>
        <p class="text-sm font-light text-muted-foreground">
            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos (enlaces, colecciones y etiquetas) de nuestros servidores.
        </p>
        
        {#if isLoadingDelete}
        <div class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm font-bold text-destructive text-center">
            <p>Mano, estoy borrando tu cuenta perdedor...</p>
            <p class="font-normal text-xs mt-1">¿Cómo vas a dejar de usar esta maravilla? Ponete las pilas.</p>
        </div>
        {/if}

        <div class="flex flex-row justify-end gap-2 mt-6">
            <Button 
                variant="outline" 
                type="button" 
                class="hover:bg-primary hover:text-secondary" 
                disabled={isLoadingDelete} 
                onclick={()=>showConfirmDialog = false}
            >
                Cancelar
            </Button>
            <Button 
                class="bg-destructive hover:bg-destructive/70 text-foreground" 
                type="submit" 
                disabled={isLoadingDelete}
            >
                {isLoadingDelete ? "Borrando..." : "Borrar cuenta"}
            </Button>
        </div>
    </form>
</ModalContainer>
{/if}