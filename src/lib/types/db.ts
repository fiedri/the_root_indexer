import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

// --- USUARIOS ---
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

// --- COLECCIONES ---
export type Collection = InferSelectModel<typeof schema.collections>;
export type NewCollection = InferInsertModel<typeof schema.collections>;

// --- LINKS ---
export type Link = InferSelectModel<typeof schema.links>;
export type NewLink = InferInsertModel<typeof schema.links>;

// --- TAGS ---
export type Tagt = InferSelectModel<typeof schema.tags>;
export type NewTag = InferInsertModel<typeof schema.tags>;

// --- RELACIONES (Tablas intermedias) ---
export type CollectionLink = InferSelectModel<typeof schema.collectionLinks>;
export type NewCollectionLink = InferInsertModel<typeof schema.collectionLinks>;

export type LinkTag = InferSelectModel<typeof schema.linkTags>;
export type NewLinkTag = InferInsertModel<typeof schema.linkTags>;

// --- TIPOS COMPUESTOS (Útiles para el UI) ---
export type LinkWithTags = Link & {
    tags: Tag[];
};

export type CollectionWithLinks = Collection & {
    links: Link[];
};
