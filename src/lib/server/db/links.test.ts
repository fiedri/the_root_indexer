/** @vitest-environment node */
import { config } from "dotenv";
config();

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getLinks, getlinksWithTags, createLinkWithTags, deleteLink, updateLink, getLinkWithTagsById } from "./links";
import { createTag, deleteTag } from "./tags";

const userId = "6b8d9da1-d99e-4147-bb7a-c961ea53c6ed";

describe("Links Service", () => {
    let tagIds: string[] = [];
    const uniqueLinkTitle = `Test Link ${Date.now()}`;
    let createdLinkId: string;

    beforeAll(async () => {
        // Creamos un par de tags para el test
        const res1 = await createTag(`Tag Link Test 1 ${Date.now()}`, userId);
        const res2 = await createTag(`Tag Link Test 2 ${Date.now()}`, userId);
        tagIds = [res1[0].id, res2[0].id];
    });

    afterAll(async () => {
        // Limpiamos los tags
        for (const id of tagIds) {
            await deleteTag(userId, id);
        }
    });

    it("debería crear un link con tags", async () => {
        try {
            const newLink = {
                url: "https://example.com/vitest",
                title: uniqueLinkTitle,
                domain: "example.com",
            };
            const result = await createLinkWithTags(userId, newLink, tagIds);
            console.log("Link creado:", result);
            
            expect(result).toBeDefined();
            expect(result.title).toBe(uniqueLinkTitle);
            expect(result.id).toBeDefined();
            
            createdLinkId = result.id;
        } catch (error) {
            console.error("ERROR EN createLinkWithTags:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener links con tags asociados", async () => {
        try {
            const result = await getlinksWithTags(userId);
            const found = result.find(l => l.id === createdLinkId);
            
            expect(found).toBeDefined();
            expect(found.title).toBe(uniqueLinkTitle);
            expect(Array.isArray(found.tags)).toBe(true);
            expect(found.tags.length).toBe(tagIds.length);
        } catch (error) {
            console.error("ERROR EN getlinksWithTags:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la lista de links planos", async () => {
        try {
            const result = await getLinks(userId);
            const found = result.find(l => l.id === createdLinkId);
            expect(found).toBeDefined();
        } catch (error) {
            console.error("ERROR EN getLinks:", error);
            throw error;
        }
    }, 15000);

    it("debería actualizar un link y sus tags", async () => {
        try {
            // Creamos un nuevo tag para el update
            const res3 = await createTag(`Tag Update Test ${Date.now()}`, userId);
            const newTagId = res3[0].id;

            const updatedTitle = `${uniqueLinkTitle} UPDATED`;
            const result = await updateLink(userId, createdLinkId, { title: updatedTitle }, [newTagId]);
            
            expect(result).not.toBeNull();
            expect(result?.title).toBe(updatedTitle);

            // Verificar con getlinksWithTags
            const allLinks = await getlinksWithTags(userId);
            const found = allLinks.find(l => l.id === createdLinkId);
            
            expect(found).toBeDefined();
            expect(found.title).toBe(updatedTitle);
            expect(found.tags.length).toBe(1);
            expect(found.tags[0].id).toBe(newTagId);

            // Limpieza del tag extra
            await deleteTag(userId, newTagId);
        } catch (error) {
            console.error("ERROR EN updateLink:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener un link específico con sus tags por ID", async () => {
        try {
            const result = await getLinkWithTagsById(createdLinkId, userId);
            expect(result).not.toBeNull();
            expect(result?.id).toBe(createdLinkId);
            expect(Array.isArray(result?.tags)).toBe(true);
        } catch (error) {
            console.error("ERROR EN getLinkWithTagsById:", error);
            throw error;
        }
    }, 15000);

    it("debería eliminar el link correctamente", async () => {
        try {
            const result = await deleteLink(userId, createdLinkId);
            expect(result).not.toBeNull();
            expect(result[0].id).toBe(createdLinkId);

            // Verificar que ya no existe
            const links = await getLinks(userId);
            const found = links.find(l => l.id === createdLinkId);
            expect(found).toBeUndefined();
        } catch (error) {
            console.error("ERROR EN deleteLink:", error);
            throw error;
        }
    }, 15000);
});
