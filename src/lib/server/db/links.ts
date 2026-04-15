import { db } from "./index";
import { collectionLinks, links, linkTags, tags } from "./schema";
import { eq, and, or } from "drizzle-orm";

interface LinkData{
    url: string;
    title: string;
    domain?: string;
    faviconUrl?: string;
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

export const createLinkWithTags = async (userId: string, linkData: LinkData, tagIds: string[]) => {
    return await db.transaction(async (tx)=>{
        const [newLink] = await tx.insert(links).values({
            ...linkData,
            userId
        }).returning();

        if(tagIds.length > 0){
            const linkTagValues = tagIds.map(tagId => ({
                linkId: newLink.id,
                tagId
            }));
            await tx.insert(linkTags).values(linkTagValues);
        }
        return newLink;
    })
}

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


export const deleteLink = async (userId: string, linkId: string) => {
    return await db.transaction(async (tx) => {
        const [link] = await tx.select()
            .from(links)
            .where(and(eq(links.id, linkId), eq(links.userId, userId)))
            .limit(1);

        if (!link) {
            return null; 
        }

        await tx.delete(linkTags).where(eq(linkTags.linkId, linkId));
        await tx.delete(collectionLinks).where(eq(collectionLinks.linkId, linkId));

        return await tx.delete(links)
            .where(eq(links.id, linkId))
            .returning();
    });
}
