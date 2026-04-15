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

<div class="min-h-screen flex justify-center items-center p-6 bg-background">
  <div
    in:scale={{ duration: 400, start: 0.95, opacity: 0 }}
    class="bg-card w-full max-w-md p-8 rounded-[2.5rem] border border-border shadow-2xl text-center relative overflow-hidden"
  >
    <!-- Decoración de fondo suave -->
    <div
      class="absolute -top-24 -right-24 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute -bottom-24 -left-24 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
    ></div>

    <!-- Icono de Éxito con Efecto de Pulso -->
    <div class="flex justify-center mb-4 relative">
      <div
        class="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse scale-150"
      ></div>
      <div
        class="relative text-primary bg-primary/10 p-6 rounded-full inline-block border-4 border-background shadow-inner"
      >
        <IconCircleCheck size={56} stroke={2.5} />
      </div>
    </div>

    <h1
      class="text-3xl font-black tracking-tight mb-4 text-foreground leading-tight"
    >
      ¡Cuenta creada <br /> con éxito!
    </h1>

    <div class="space-y-5 mb-5">
      <p class="text-muted-foreground leading-relaxed font-medium">
        Casi terminamos. Te enviamos un enlace de confirmación a <span class="text-foreground font-bold">{email || 'tu correo'}</span>.
      </p>

      <!-- FEEDBACK DE ESTADO (EXITO/ERROR) -->
      {#if message}
        <div 
          in:fade
          class="{isError ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'} p-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold border border-current/10"
        >
          {#if isError} <IconAlertCircle size={18}/> {:else} <IconCircleCheck size={18}/> {/if}
          <span>{message}</span>
        </div>
      {:else}
        <div
          class="bg-muted/40 p-5 rounded-[1.5rem] flex items-center gap-4 border border-border/40 backdrop-blur-sm"
        >
          <div class="bg-primary/20 p-2 rounded-lg text-primary">
            <IconMail size={22} />
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-foreground">Bandeja de entrada</p>
            <p class="text-xs text-muted-foreground">
              Revisa también tu carpeta de spam.
            </p>
          </div>
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-4">
      <a
        href="/auth/sign-in"
        class="bg-primary flex justify-center items-center py-4 rounded-2xl w-full font-black text-primary-foreground shadow-xl shadow-primary/20 group transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Ir al Inicio de Sesión</span>
        <IconArrowRight
          size={20}
          class="ml-2 transition-transform group-hover:translate-x-1 inline-block"
        />
      </a>

      <div class="pt-2 space-y-2">
        <p class="text-xs text-muted-foreground font-medium">
          ¿No recibiste el correo?
        </p>
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
                message = "¡Enviado correctamente!";
              }
            };
          }}
        >
          <Button
            type="submit"
            disabled={resending}
            class="text-primary font-black hover:text-primary/80 transition-colors text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if resending}
              <IconLoader2 size={16} class="animate-spin" />
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
    0%, 100% { opacity: 0.3; transform: scale(1.5); }
    50% { opacity: 0.6; transform: scale(1.8); }
  }
  .animate-pulse {
    animation: pulse-custom 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
