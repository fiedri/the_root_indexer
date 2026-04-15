/** @vitest-environment node */
import { config } from "dotenv";
config();

import { describe, it, expect } from "vitest";
import { getTags, createTag, deleteTag } from "./tags";

const userId = "6b8d9da1-d99e-4147-bb7a-c961ea53c6ed";

describe("Tags Service", () => {
    const uniqueTagName = `Test Tag ${Date.now()}`;
    let createdTagId: string;

    it("debería crear un tag correctamente", async () => {
        try {
            console.log(`Creando tag de prueba: ${uniqueTagName}`);
            const result = await createTag(uniqueTagName, userId);
            console.log("Tag creado:", result);
            
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].name).toBe(uniqueTagName);
            
            createdTagId = result[0].id;
        } catch (error) {
            console.error("ERROR EN createTag:", error);
            throw error;
        }
    }, 15000);

    it("debería obtener la lista de tags incluyendo el nuevo", async () => {
        try {
            const tags = await getTags(userId);
            console.log(`Tags encontrados: ${tags.length}`);
            
            const found = tags.find(t => t.name === uniqueTagName);
            expect(found).toBeDefined();
            expect(found?.id).toBe(createdTagId);
        } catch (error) {
            console.error("ERROR EN getTags:", error);
            throw error;
        }
    }, 15000);

    it("debería fallar al intentar eliminar sin argumentos", async () => {
        await expect(deleteTag(userId)).rejects.toThrow("Se requiere tagId o name para eliminar un tag.");
    }, 15000);

    it("debería eliminar el tag por nombre y quedar limpio", async () => {
        try {
            console.log(`Eliminando tag por nombre: ${uniqueTagName}`);
            const result = await deleteTag(userId, undefined, uniqueTagName);
            expect(result.success).toBe(true);

            // Verificar que ya no existe
            const tags = await getTags(userId);
            const found = tags.find(t => t.name === uniqueTagName);
            expect(found).toBeUndefined();
        } catch (error) {
            console.error("ERROR EN deleteTag:", error);
            throw error;
        }
    }, 15000);
});
