<script lang="ts">
    import { IconLink, IconAlertCircle } from "@tabler/icons-svelte";
    import { Input } from "$lib/components/ui/input/index.js";
    import Button from "$lib/components/ui/button/Button.svelte";
    import type { ActionData } from './$types';

    // Svelte 5: Recibimos el objeto 'form' con los errores del servidor
    let { form } = $props() as { form: ActionData };
</script>

<div class="min-h-screen flex justify-center items-center">
    <div class="bg-card sm:w-2/4 p-8 md:w-2/6 rounded-3xl border border-border shadow-md">
        <div class="flex flex-col justify-center items-center mb-6">
            <div class="text-primary bg-primary/10 p-3 rounded-2xl inline-block" >
                <IconLink size={24} stroke={2.5}/>
            </div>
            <h2 class="text-2xl font-bold mt-4">¡Hola otra vez!</h2>
            <p class="text-sm text-muted-foreground">Accede a tu cuenta</p>
        </div>

        <!-- MOSTRAR ERROR SI EXISTE -->
        {#if form?.error}
            <div class="bg-destructive/15 text-destructive text-sm p-4 rounded-xl flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                <IconAlertCircle size={20} />
                <span class="font-medium">{form.error}</span>
            </div>
        {/if}

        <form class="flex flex-col w-full gap-5" method="POST">
            <div class="flex flex-col gap-1.5">
                <label for="email" class="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                <Input 
                    name="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    id="email" 
                    value={form?.email ?? ''}
                    class={form?.error ? 'border-destructive focus-visible:ring-destructive' : ''}
                    required 
                />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="password" class="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Contraseña</label>
                <Input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    id="password" 
                    class={form?.error ? 'border-destructive focus-visible:ring-destructive' : ''}
                    required 
                />
            </div>

            <Button class="w-full mt-2 font-bold text-base rounded-2xl" type="submit">
                Iniciar Sesión
            </Button>
            
            <p class="text-xs text-muted-foreground text-center mt-2">
                ¿No tienes una cuenta? 
                <a href="/auth/sign-up" class="text-primary hover:underline font-bold text-sm">Regístrate</a>
            </p>
        </form>
    </div>
</div>
