import { db } from "./index";
import { linkTags, tags } from "./schema";
import { eq, and, or, inArray } from "drizzle-orm";

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

    const condition = tagId 
        ? and(eq(tags.id, tagId), eq(tags.userId, userId))
        : and(eq(tags.name, name!), eq(tags.userId, userId));

    const result = await db.delete(tags)
        .where(condition)
        .returning();

    return { success: result.length > 0 };
}

export const deleteTags = async (userId: string, tagIds: string[]) => {
    if (tagIds.length === 0) return { success: true };

    // Borramos todos los tags que coincidan con los IDs Y pertenezcan al usuario
    await db.delete(tags).where(
        and(
            inArray(tags.id, tagIds),
            eq(tags.userId, userId)
        )
    );

    return { success: true };
}