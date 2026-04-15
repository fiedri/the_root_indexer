import { db } from "./index";
import { linkTags, tags } from "./schema";
import { eq, and, or } from "drizzle-orm";

export const getTags = async (userId: string)=> {
    return await db.select().from(tags).where(eq(tags.userId, userId));
}

export const createTag = async (name: string, userId: string) => {
    return await db.insert(tags).values({
        name,
        userId
    }).returning();
}

export const deleteTag = async (userId: string, tagId?: string, name?: string) => {
    if (!tagId && !name) {
        throw new Error("Se requiere tagId o name para eliminar un tag.");
    }

    return await db.transaction(async (tx) => {
        
        let finalTagId = tagId;

        if (!finalTagId && name) {
            const [foundTag] = await tx.select()
                .from(tags)
                .where(and(eq(tags.name, name), eq(tags.userId, userId)))
                .limit(1);
            
            if (!foundTag) return { success: false, message: "Tag no encontrado" };
            finalTagId = foundTag.id;
        }

        if (finalTagId) {
            // Borrar relaciones
            await tx.delete(linkTags).where(eq(linkTags.tagId, finalTagId));
            
            // Borrar el tag propiamente (añadimos userId por seguridad extra)
            await tx.delete(tags).where(
                and(
                    eq(tags.id, finalTagId), 
                    eq(tags.userId, userId)
                )
            );
        }

        return { success: true };
    });
}