<script lang="ts">
  import {
    IconCircleCheck,
    IconMail,
    IconArrowRight,
    IconLoader2,
    IconAlertCircle,
  } from "@tabler/icons-svelte";
  import Button from "$lib/components/ui/button/Button.svelte";
  import { fade, scale } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";

  let resending = $state(false);
  let message = $state("");
  let isError = $state(false);

  const email = page.url.searchParams.get("email") ?? "";
</script>

<div class="min-h-screen flex justify-center items-center p-4 bg-background">
  <div
    in:scale={{ duration: 400, start: 0.95, opacity: 0 }}
    class="bg-card w-full max-w-sm p-6 rounded-3xl border border-border shadow-2xl text-center relative overflow-hidden"
  >
    <!-- Decoración de fondo suave -->
    <div class="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

    <!-- Icono de Éxito con Efecto de Pulso -->
    <div class="flex justify-center mb-3 relative">
      <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse scale-125"></div>
      <div class="relative text-primary bg-primary/10 p-4 rounded-full inline-block border-2 border-background shadow-inner">
        <IconCircleCheck size={40} stroke={2.5} />
      </div>
    </div>

    <h1 class="text-2xl font-black tracking-tight mb-2 text-foreground leading-tight">
      ¡Cuenta creada!
    </h1>

    <div class="space-y-3 mb-4">
      <p class="text-sm text-muted-foreground leading-relaxed font-medium px-2">
        Te enviamos un enlace a <span class="text-foreground font-bold">{email || 'tu correo'}</span>. Por favor, confirmalo para entrar.
      </p>

      <!-- FEEDBACK DE ESTADO (EXITO/ERROR) -->
      {#if message}
        <div 
          in:fade
          class="{isError ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'} p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-current/10"
        >
          {#if isError} <IconAlertCircle size={16}/> {:else} <IconCircleCheck size={16}/> {/if}
          <span>{message}</span>
        </div>
      {:else}
        <div class="bg-muted/40 p-3 rounded-2xl flex items-center gap-3 border border-border/40 backdrop-blur-sm">
          <div class="bg-primary/20 p-2 rounded-lg text-primary">
            <IconMail size={18} />
          </div>
          <div class="text-left">
            <p class="text-xs font-bold text-foreground">Bandeja de entrada</p>
            <p class="text-[10px] text-muted-foreground">Revisa también tu carpeta de spam.</p>
          </div>
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-3">
      <a
        href="/auth/sign-in"
        class="bg-primary flex justify-center items-center py-3 rounded-xl w-full font-black text-primary-foreground shadow-lg shadow-primary/20 group transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <span class="text-sm">Ir al Inicio de Sesión</span>
        <IconArrowRight size={18} class="ml-2 transition-transform group-hover:translate-x-1 inline-block" />
      </a>

      <div class="pt-1 space-y-1">
        <p class="text-[10px] text-muted-foreground font-medium">¿No recibiste el correo?</p>
        <form
          action="?/resend"
          method="POST"
          use:enhance={() => {
            resending = true;
            message = "";
            return ({ result }) => {
              resending = false;
              if (result.type === "failure") {
                isError = true;
                // @ts-ignore
                message = result.data?.error || "Error al reenviar";
              } else if (result.type === "success") {
                isError = false;
                message = "¡Reenviado con éxito!";
              }
            };
          }}
        >
          <Button
            type="submit"
            disabled={resending}
            class="text-secondary font-bold hover:text-primary/80 transition-colors text-[11px] flex items-center justify-center gap-1 mx-auto disabled:opacity-50"

          >
            {#if resending}
              <IconLoader2 size={12} class="animate-spin" />
              Reenviando...
            {:else}
              Reenviar enlace de confirmación
            {/if}
          </Button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes pulse-custom {
    0%, 100% { opacity: 0.3; transform: scale(1.2); }
    50% { opacity: 0.5; transform: scale(1.4); }
  }
  .animate-pulse {
    animation: pulse-custom 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
