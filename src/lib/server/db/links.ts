import { db } from "./index";
import { collectionLinks, links, linkTags, tags } from "./schema";
import { eq, and, or, inArray } from "drizzle-orm";

interface LinkData{
    url: string;
    title: string;
    domain?: string;
    faviconUrl?: string;
    description?: string;
}

export const getLinks = async (userId: string) => {
    return await db
        .select()
        .from(links)
        .where(eq(links.userId, userId));
};

export const getlinksWithTags = async (userId: string) => {
    const results = await db
        .select({
            link: links,
            tag: tags
        })
        .from(links)
        .leftJoin(linkTags, eq(links.id, linkTags.linkId))
        .leftJoin(tags, eq(linkTags.tagId, tags.id))
        .where(eq(links.userId, userId));

    const linksMap = results.reduce((acumulador, { link, tag }) => {
        if (!acumulador[link.id]) {
            acumulador[link.id] = {
                ...link,
                tags: []
            };
        }
        if (tag) {
            acumulador[link.id].tags.push(tag);
        }

        return acumulador;
    }, {} as Record<string, any>);

    
    return Object.values(linksMap);
};

export const getLinkWithTagsById = async (linkId: string, userId: string) => {
    const results = await db
        .select({
            link: links,
            tag: tags
        })
        .from(links)
        .leftJoin(linkTags, eq(links.id, linkTags.linkId))
        .leftJoin(tags, eq(linkTags.tagId, tags.id))
        .where(and(eq(links.id, linkId), eq(links.userId, userId)));

    if (results.length === 0) return null;

    return {
        ...results[0].link,
        tags: results.map(r => r.tag).filter(t => t !== null)
    };
};

export const createFullLink = async (userId: string, linkData: Partial<LinkData>, tagIds: string[] = [], collectionIds: string[] = []) => {
    return await db.transaction(async (tx) => {
        const [newLink] = await tx.insert(links).values({
            ...linkData,
            userId
        }).returning();

        // Insertar tags si hay
        if (tagIds.length > 0) {
            const linkTagValues = tagIds.map(tagId => ({
                linkId: newLink.id,
                tagId
            }));
            await tx.insert(linkTags).values(linkTagValues);
        }

        // Insertar colecciones si hay
        if (collectionIds.length > 0) {
            const collectionLinkValues = collectionIds.map(collectionId => ({
                collectionId,
                linkId: newLink.id
            }));
            await tx.insert(collectionLinks).values(collectionLinkValues);
        }

        return newLink;
    });
};

export const updateLink = async (userId: string, linkId: string, linkData: Partial<LinkData>, tagIds?: string[]) => {
    return await db.transaction(async (tx) => {
        const [updatedLink] = await tx.update(links)
            .set({
                ...linkData,
                updatedAt: new Date()
            })
            .where(and(eq(links.id, linkId), eq(links.userId, userId)))
            .returning();

        if (!updatedLink) return null;

        if (tagIds) {
            // Eliminar tags actuales
            await tx.delete(linkTags).where(eq(linkTags.linkId, linkId));

            if (tagIds.length > 0) {
                // Insertar nuevos tags
                const linkTagValues = tagIds.map(tagId => ({
                    linkId,
                    tagId
                }));
                await tx.insert(linkTags).values(linkTagValues);
            }
        }

        return updatedLink;
    });
}


export const deleteLinks = async (userId: string, linkIds: string[]) => {
    if (linkIds.length === 0) return [];
    
    return await db.delete(links)
        .where(
            and(
                eq(links.userId, userId),
                inArray(links.id, linkIds)
            )
        )
        .returning();
};
