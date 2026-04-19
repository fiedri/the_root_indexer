<script lang="ts">
    import { IconUserPlus, IconAlertCircle, IconEye, IconEyeOff } from "@tabler/icons-svelte";
    import { Input } from "$lib/components/ui/input/index.js";
    import Button from "$lib/components/ui/button/Button.svelte";
    import type { ActionData } from './$types';

    let { form } = $props() as { form: ActionData };

    let showPassword = $state(false);
    let showConfirmPassword = $state(false);
</script>

<div class="min-h-screen flex justify-center items-center">
    <div class="bg-card sm:w-2/4 p-8 md:w-2/6 rounded-3xl border border-border shadow-md">
        <div class="flex flex-col justify-center items-center mb-6">
            <div class="text-primary bg-primary/10 p-3 rounded-2xl inline-block" >
                <IconUserPlus size={24} stroke={2.5}/>
            </div>
            <h2 class="text-2xl font-bold mt-4">Crear cuenta</h2>
            <p class="text-sm text-muted-foreground">Únete a nosotros hoy mismo</p>
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
                <div class="relative">
                    <Input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 6 caracteres" 
                        id="password" 
                        class={form?.error ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
                        required 
                    />
                    <button 
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onclick={() => showPassword = !showPassword}
                        tabindex="-1"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {#if showPassword}
                            <IconEyeOff size={18} />
                        {:else}
                            <IconEye size={18} />
                        {/if}
                    </button>
                </div>
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="confirmPassword" class="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirmar Contraseña</label>
                <div class="relative">
                    <Input 
                        name="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Repite tu contraseña" 
                        id="confirmPassword" 
                        class={form?.error ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
                        required 
                    />
                    <button 
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onclick={() => showConfirmPassword = !showConfirmPassword}
                        tabindex="-1"
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {#if showConfirmPassword}
                            <IconEyeOff size={18} />
                        {:else}
                            <IconEye size={18} />
                        {/if}
                    </button>
                </div>
            </div>

            <Button class="w-full mt-2 font-bold text-base rounded-2xl" type="submit">
                Registrarse
            </Button>
            
            <p class="text-xs text-muted-foreground text-center mt-2">
                ¿Ya tienes una cuenta? 
                <a href="/auth/sign-in" class="text-primary hover:underline font-bold text-sm">Inicia Sesión</a>
            </p>
        </form>
    </div>
</div>
