import { uuid, timestamp, integer, pgTable, pgSchema, text, boolean, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

export const collections = pgTable('collections', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    // onDelete elimina los datos en cascada si se elimna el usuario
    name: text('name').notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true
    }).defaultNow(),
}, (table) => ({
    userIdIndex: index('idx_collections_user_id').on(table.userId),
    isPublicIndex: index('idx_collections_is_public').on(table.isPublic),
}));

export const links = pgTable('links', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    url: text('url').notNull(),
    title: text('title').notNull(),
    domain: text('domain'),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true
    }).defaultNow(),
    faviconUrl: text('favicon_url'),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    description: text('description'),
}, (table) => ({
    userIdIndex: index('idx_links_user_id').on(table.userId),
    domainIndex: index('idx_links_domain').on(table.domain),
    createdAtIndex: index('idx_links_created_at').on(table.createdAt.desc()),
}));

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
    userIdIndex: index('idx_tags_user_id').on(table.userId),
    nameIndex: index('idx_tags_name').on(table.name),
    uniqueTagNamePerUser: uniqueIndex('tags_name_user_id_unique').on(table.name, table.userId),
}));

export const collectionLinks = pgTable('collection_links', {
    collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    linkId: uuid('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.linkId] }),
    collectionIdIndex: index('idx_collection_links_collection_id').on(table.collectionId),
    linkIdIndex: index('idx_collection_links_link_id').on(table.linkId),
}));

export const linkTags = pgTable('link_tags', {
    linkId: uuid('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.linkId, table.tagId] }),
    linkIdIndex: index('idx_link_tags_link_id').on(table.linkId),
    tagIdIndex: index('idx_link_tags_tag_id').on(table.tagId),
}));
