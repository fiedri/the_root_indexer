# 📋 Root Indexer - Tareas Pendientes (TODO)

Este documento centraliza las tareas necesarias para llevar el proyecto de una maqueta UI a una aplicación funcional.

---

## 🚀 Prioridad Alta: Cimientos y Datos
- [x] **Configurar Base de Datos**: Elegir y configurar un ORM (Drizzle o Prisma recomendado) para interactuar con el esquema definido en `db/db.sql`.
- [x] **Implementar Autenticación**: Conectar los formularios de `sign-in` y `sign-up` con un proveedor (Supabase Auth).
- [x] **API / Form Actions para Links**: Crear las acciones de SvelteKit para guardar links reales en la base de datos desde `AddLinkForm.svelte`.
- [ ] **Listado Dinámico**: Reemplazar los datos hardcoded en el Dashboard por una consulta real a la base de datos.

## 🛠️ Prioridad Media: Funcionalidad Core
- [ ] **Scraping de Metadatos**: Implementar una función en el servidor que, al recibir una URL, extraiga automáticamente el `title`, `description` y `favicon` del sitio.
- [ ] **Gestión de Colecciones**: Hacer que `CreateCollectionForm.svelte` funcione, permitiendo agrupar links y guardarlos.
- [ ] **Sistema de Tags**: Implementar la lógica para añadir/quitar etiquetas a los links y filtrar por ellas.
- [ ] **Búsqueda Real**: Conectar el `search-input.svelte` con una búsqueda por texto en la base de datos.

## ✨ Prioridad Baja: Pulido y UX
- [ ] **Feedback de Usuario**: Añadir estados de carga (loading) y notificaciones (toasts) al guardar o fallar una acción.
- [ ] **Edición y Borrado**: Añadir opciones en la `LinkCard.svelte` para editar o eliminar enlaces y colecciones.
- [ ] **Optimización de Imágenes**: Asegurar que los favicons y posibles previews de links se carguen de forma eficiente.
- [ ] **Testing**: Configurar Vitest para pruebas unitarias de la lógica de scraping y componentes.

---

## 📂 Estado del Stack
- **Frontend**: Svelte 5 (Runes) + Tailwind CSS (Avanzado).
- **Backend**: SvelteKit (Estructura lista, lógica pendiente).
- **DB**: Esquema SQL definido (PostgreSQL/Supabase ready).
