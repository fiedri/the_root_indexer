import { uuid,timestamp, integer, pgTable, pgSchema,text, boolean, primaryKey } from "drizzle-orm/pg-core";


export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

export const collections = pgTable('collections', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id').notNull().references(()=> users.id),// reference
    name: text('name').notNull(),
    isPublic: boolean('is_public').default(false),
    createAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true
    }).defaultNow(),
})

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
    userId: uuid('user_id').references(()=>users.id),//reference
    
})

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    userId: uuid('user_id').references(() => users.id),
})

export const collectionLinks = pgTable('collection_links', {
    collectionId: uuid('collection_id').notNull().references(() => collections.id),
    linkId: uuid('link_id').notNull().references(() => links.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.linkId] }),
}));

export const linkTags = pgTable('link_tags', {
    linkId: uuid('link_id').notNull().references(()=> links.id), // reference
    tagId: uuid('tag_id').notNull().references(()=> tags.id),    // reference
}, (table) => ({
    pk: primaryKey({ columns: [table.linkId, table.tagId] })
}));
