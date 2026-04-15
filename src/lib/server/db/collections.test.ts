/** @vitest-environment node */
import { config } from "dotenv";
config();

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getCollections, getCollectionWithLinksByName, createCollection, deleteCollection, getCollectionByName, updateCollection, getCollectionWithLinksById } from "./collections";
import { createLinkWithTags, deleteLink } from "./links";

const userId = "6b8d9da1-d99e-4147-bb7a-c961ea53c6ed";

describe("Collections Service", () => {
    let linkIds: string[] = [];
    const uniqueCollectionName = `Test Collection ${Date.now()}`;
    let createdCollectionId: string;

    beforeAll(async () => {
        // Creamos links temporales para la colección
        const l1 = await createLinkWithTags(userId, { url: "https://test1.com", title: "Link 1" }, []);
        const l2 = await createLinkWithTags(userId, { url: "https://test2.com", title: "Link 2" }, []);
        linkIds = [l1.id, l2.id];
    });

    afterAll(async () => {
        // Limpiamos los links
        for (const id of linkIds) {
            await deleteLink(userId, id);
        }
    });

    it("debería crear una colección con links", async () => {
        try {
            const collectionData = {
                name: uniqueCollectionName,
                isPublic: false
            };
            const result = await createCollection(userId, collectionData, linkIds);
            console.log("Colección creada:", result);
            
            expect(result).toBeDefined();
            expect(result.name).toBe(uniqueCollectionName);
            expect(result.id).toBeDefined();
            
            createdCollectionId = result.id;
        } catch (error) {
            console.error("ERROR EN createCollection:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la lista de colecciones del usuario", async () => {
        try {
            const colecciones = await getCollections(userId);
            const found = colecciones.find(c => c.id === createdCollectionId);
            expect(found).toBeDefined();
            expect(found?.name).toBe(uniqueCollectionName);
        } catch (error) {
            console.error("ERROR EN getCollections:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la colección por su nombre", async () => {
        try {
            const collection = await getCollectionByName(uniqueCollectionName, userId);
            expect(collection).toBeDefined();
            expect(collection?.id).toBe(createdCollectionId);
        } catch (error) {
            console.error("ERROR EN getCollectionByName:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la colección con sus links por nombre", async () => {
        try {
            const result = await getCollectionWithLinksByName(uniqueCollectionName, userId);
            expect(result).not.toBeNull();
            expect(result?.name).toBe(uniqueCollectionName);
            expect(Array.isArray(result?.links)).toBe(true);
            expect(result?.links.length).toBe(linkIds.length);
        } catch (error) {
            console.error("ERROR EN getCollectionWithLinksByName:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la colección con sus links por ID", async () => {
        try {
            const result = await getCollectionWithLinksById(createdCollectionId, userId);
            expect(result).not.toBeNull();
            expect(result?.id).toBe(createdCollectionId);
            expect(Array.isArray(result?.links)).toBe(true);
        } catch (error) {
            console.error("ERROR EN getCollectionWithLinksById:", error);
            throw error;
        }
    }, 15000);

    it("debería actualizar una colección y sus links", async () => {
        try {
            // Creamos un nuevo link para el update
            const l3 = await createLinkWithTags(userId, { url: "https://test3.com", title: "Link 3" }, []);
            const newLinkId = l3.id;

            const updatedName = `${uniqueCollectionName} UPDATED`;
            const result = await updateCollection(userId, createdCollectionId, { name: updatedName }, [newLinkId]);
            
            expect(result).not.toBeNull();
            expect(result?.name).toBe(updatedName);

            // Verificar con getCollectionWithLinksByName
            const collection = await getCollectionWithLinksByName(updatedName, userId);
            expect(collection).not.toBeNull();
            expect(collection?.links.length).toBe(1);
            expect(collection?.links[0].id).toBe(newLinkId);

            // Limpieza del link extra
            await deleteLink(userId, newLinkId);
        } catch (error) {
            console.error("ERROR EN updateCollection:", error);
            throw error;
        }
    }, 15000);

    it("debería eliminar la colección correctamente", async () => {
        try {
            const result = await deleteCollection(userId, createdCollectionId);
            expect(result).not.toBeNull();
            
            // Verificar que ya no existe
            const colecciones = await getCollections(userId);
            const found = colecciones.find(c => c.id === createdCollectionId);
            expect(found).toBeUndefined();
        } catch (error) {
            console.error("ERROR EN deleteCollection:", error);
            throw error;
        }
    }, 15000);
});
