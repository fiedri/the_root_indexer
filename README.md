# ROOT Indexer 🚀

**ROOT Indexer** es tu biblioteca personal e inteligente de enlaces. Nacida de la necesidad de un programador de organizar recursos técnicos, esta herramienta permite capturar, etiquetar y estructurar el conocimiento de forma eficiente.

Más que un simple gestor de marcadores, ROOT Indexer está diseñado para convertir el caos de enlaces sueltos en **colecciones con propósito**: roadmaps de aprendizaje, listas de recursos para proyectos o cursos compartidos.

## ✨ Características

- **Gestión de Enlaces**: Guarda links con extracción automática de metadatos (favicon, dominio).
- **Etiquetado Inteligente**: Sistema de tags con filtrado para encontrar lo que buscás.
- **Colecciones Compartibles**: Agrupá tus enlaces en colecciones y compartelas con el mundo mediante enlaces públicos. Ideal para crear Roadmaps.
- **PWA Ready**: Instalá la aplicación en tu móvil o escritorio para un acceso rápido y una experiencia nativa.

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/)
- **Meta-framework**: [SvelteKit](https://kit.svelte.dev/).
- **Backend/Auth**: [Supabase](https://supabase.com/).
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/).
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/).
- **Iconos**: [Tabler Icons](https://tabler-icons.io/).

## 🚀 Instalación y Desarrollo

Para levantar el proyecto localmente, seguí estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/root-indexer.git
   cd root-indexer
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar el entorno:**
   Copia el archivo `.env.example` a `.env` y completá tus credenciales de Supabase y la URL de tu base de datos.
   ```bash
   cp .env.example .env
   ```

4. **Correr en modo desarrollo:**
   ```bash
   pnpm run dev
   ```

## 📂 Estructura de Colecciones

El objetivo de ROOT Indexer es la capacidad de compartir. Si sos educador o simplemente querés ayudar a otros, podés crear una colección pública y pasar el link. El receptor verá una página optimizada para el consumo de esos recursos, sin necesidad de estar logueado.