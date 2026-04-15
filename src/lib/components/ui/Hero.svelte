<script>
    import Button from "./button/Button.svelte";
</script>
<section class="min-h-[80vh] flex flex-col items-center
      justify-center text-center py-20 px-6 max-w-4xl mx-auto gap-y-2">
    <div class="">
        <h1 class="sm:text-4xl md:text-6xl font-black
      tracking-tighter leading-tight text-3xl capitalize">Tu segundo cerebro para recursos de codigo.</h1>
    <p class="text-muted-foreground text-lg md:text-xl
      max-w-2xl mx-auto">
Gestiona y recupera al instante todos tus recursos de programación sin perder nada.</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 mt-10 w-full
      sm:w-auto">
        <Button variant="primary" class="text-sm sm:text-base
      px-8 py-3">Comienza a construir tu cerebro &rarr;</Button>
        <Button variant="outline" class="text-sm sm:text-base
      px-8 py-3 hover:bg-secondary">Log in</Button>
    </div>
</section>