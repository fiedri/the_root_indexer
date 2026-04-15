import { db } from "./index";
import { collections, collectionLinks, links } from "./schema";
import { eq, and } from "drizzle-orm";


export const getCollections = async(userId: string) => {
    return await db
        .select()
        .from(collections)
        .where(eq(collections.userId, userId));
}

export const getCollectionByName = async (name: string, userId: string) => {
    const result = await db
        .select()
        .from(collections)
        .where(
            and(
                eq(collections.name, name),
                eq(collections.userId, userId)
            )
        )
        .limit(1);

    return result[0];
};


export const getCollectionWithLinksByName = async (name: string, userId: string) => {
    const result = await db
        .select({
            collection: collections,
            link: links
        })
        .from(collections)
        .leftJoin(collectionLinks, eq(collections.id, collectionLinks.collectionId))
        .leftJoin(links, eq(collectionLinks.linkId, links.id))
        .where(
            and(
                eq(collections.name, name),
                eq(collections.userId, userId)
            )
        );

    if (result.length === 0) return null;

  
    return {
        ...result[0].collection,
        links: result.map(r => r.link).filter(l => l !== null)
    };
};

export const getCollectionWithLinksById = async (collectionId: string, userId: string) => {
    const result = await db
        .select({
            collection: collections,
            link: links
        })
        .from(collections)
        .leftJoin(collectionLinks, eq(collections.id, collectionLinks.collectionId))
        .leftJoin(links, eq(collectionLinks.linkId, links.id))
        .where(
            and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            )
        );

    if (result.length === 0) return null;

    return {
        ...result[0].collection,
        links: result.map(r => r.link).filter(l => l !== null)
    };
};

export const createCollection = async (userId: string, collectionData: any, linkIds: string[]) => {
    return await db.transaction(async (tx) => {
        const [newCollection] = await tx.insert(collections).values({
            ...collectionData,
            userId
        }).returning();

        if (linkIds.length > 0) {
            const collectionLinkValues = linkIds.map(linkId => ({
                collectionId: newCollection.id,
                linkId
            }));
            await tx.insert(collectionLinks).values(collectionLinkValues);
        }

        return newCollection;
    });
}

export const updateCollection = async (userId: string, collectionId: string, collectionData: any, linkIds?: string[]) => {
    return await db.transaction(async (tx) => {
        const [updatedCollection] = await tx.update(collections)
            .set({
                ...collectionData,
                updatedAt: new Date()
            })
            .where(and(eq(collections.id, collectionId), eq(collections.userId, userId)))
            .returning();

        if (!updatedCollection) return null;

        if (linkIds) {
            await tx.delete(collectionLinks).where(eq(collectionLinks.collectionId, collectionId));

            if (linkIds.length > 0) {
                const collectionLinkValues = linkIds.map(linkId => ({
                    collectionId,
                    linkId
                }));
                await tx.insert(collectionLinks).values(collectionLinkValues);
            }
        }

        return updatedCollection;
    });
}

export const deleteCollection = async (userId: string, collectionId: string)=>{
    return await db.transaction(async (tx)=>{
        const [collection] = await tx.select().from(collections).where(
            and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            )
        )
        if (!collection) return null;

        await tx.delete(collectionLinks).where(eq(collectionLinks.collectionId, collectionId));
        return await tx.delete(collections).where(eq(collections.id, collectionId)).returning();
    })
}