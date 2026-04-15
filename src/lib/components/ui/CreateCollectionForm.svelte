<script>
  import Button from "./button/Button.svelte";
  import ModalContainer from "./container/ModalContainer.svelte";
  import Input from "./input/input.svelte";
  import SearchInput from "./input/search-input.svelte";
  let {close} = $props()
</script>

<ModalContainer {close}>
  <div class="p-3 border-border border-b">
  
    <h2 class="text-lg font-bold">Crear coleccion</h2>
    <p class="text-sm py-2 text-muted-foreground font-light tracking-tight">
      Agrupe enlaces en una hoja de ruta o colección inteligente.
    </p>
  </div>

  <form
    action=""
    class="flex flex-col overflow-hidden min-h-0 gap-3 text-muted-foreground"
  >
    <div
      class="flex-1 overflow-y-auto space-y-5 box-border max-h-80 px-6 mt-3 pt-6"
    >
      <label for="" class="uppercase text-sm font-bold">Nombre</label>
      <Input placeholder="e.j. Rust Roadmap" />
      <label for="" class="uppercase text-sm font-bold">Descripcion</label>
      <textarea
        name=""
        id=""
        class="bg-card focus-visible:border-primary focus-visible:ring-primary/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border text-sm transition-colors file:text-xs/relaxed file:font-medium focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        placeholder="Sobre que es la coleccion?"
      ></textarea>
      <div
        class="flex justify-between items-center border-border border rounded-xl p-2.5 bg-card"
      >
        <div class="flex flex-col">
          <p class="uppercase text-sm font-bold">Coleccion publica</p>
          <p class="text-xs tracking-tight">Visible para cualquier persona con el enlace.</p>
        </div>
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" />
          <div
            class="peer-checked:bg-primary relative w-9 h-5 bg-background/90 peer-focus:outline-none transition-all rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"
          ></div>
        </label>
      </div>
      <div class="flex-1 overflow-y-auto space-y-5 box-border min-h-0">
        <div class="flex justify-between items-center border-border border-b">
          <label for="" class="uppercase text-sm font-bold"
            >Seleccion de links</label
          >
          <p
            class="inline border-border border rounded-xl px-0.5 uppercase text-xs"
          >
            <span>0</span> seleccionados
          </p>
        </div>
        <div>
          <SearchInput class="" placeholder="Filtrar por titulo o url..." />
          <div class="border-border border">
            <span class="inline px-1.5">Todos</span>
          </div>
          <div
            class="rounded-md border-border border box-border overflow-hidden"
          >
            <div class="max-h-55 overflow-y-auto p-1 space-y-1">
              <div>
                <div>
                  <span>Titulo del link</span>
                  <span>link</span>
                </div>
              </div>
              <div class="hover:bg-primary">
                <span>Titulo del link</span>
                <span>link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-1 justify-end border-border border-t p-4">
      <Button variant={"ghost"} class="hover:bg-destructive hover:text-foreground"
        onclick={close}>Cancelar</Button
      >
      <Button variant={"primary"}>Crear coleccion.</Button>
    </div>
  </form>

</ModalContainer>