export const uiState = $state({
    openMenuSm: false,
    toggleMenuSm() {
        this.openMenuSm = !this.openMenuSm;
    },
    
    // Gestión de Tags
    deletedTagIds: [] as string[],
    markTagAsDeleted(id: string) {
        if (!this.deletedTagIds.includes(id)) this.deletedTagIds.push(id);
    },
    clearDeletedTags() {
        this.deletedTagIds = [];
    },
    isTagDeleted(id: string) {
        return this.deletedTagIds.includes(id);
    },

    // Gestión de Links
    deletedLinkIds: [] as string[],
    markLinkAsDeleted(id: string) {
        if (!this.deletedLinkIds.includes(id)) this.deletedLinkIds.push(id);
    },
    clearDeletedLinks() {
        this.deletedLinkIds = [];
    },
    isLinkDeleted(id: string) {
        return this.deletedLinkIds.includes(id);
    },

    // Gestión de Colecciones Optimistas
    optimisticCollections: [] as any[],
    addOptimisticCollection(collection: any) {
        this.optimisticCollections.push(collection);
    },
    removeOptimisticCollection(tempId: string) {
        this.optimisticCollections = this.optimisticCollections.filter(c => c.id !== tempId);
    },
    clearOptimisticCollections() {
        this.optimisticCollections = [];
    },

    // Gestión de Etiquetas Globales
    allTags: [] as any[],
    setAllTags(tags: any[]) {
        this.allTags = tags;
    },

    // Gestión de Filtros de Etiquetas
    activeFilterTags: new Set<string>(),
    toggleFilterTag(tagId: string) {
        if (this.activeFilterTags.has(tagId)) {
            this.activeFilterTags.delete(tagId);
        } else {
            this.activeFilterTags.add(tagId);
        }
        // Reasignamos para reactividad en Svelte 5 con Set
        this.activeFilterTags = new Set(this.activeFilterTags);
    },
    clearFilterTags() {
        this.activeFilterTags = new Set<string>();
    },
    isTagFilterActive(tagId: string) {
        return this.activeFilterTags.has(tagId);
    },

    // Gestión de Edición de Colección
    editingCollection: null as any,
    setEditingCollection(collection: any) {
        this.editingCollection = collection;
    },
    clearEditingCollection() {
        this.editingCollection = null;
    },

    // Gestión de Instalación PWA
    installPrompt: null as any,
    setInstallPrompt(prompt: any) {
        this.installPrompt = prompt;
    }
});
