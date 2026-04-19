import { redirect, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { deleteTags, createTag } from "$lib/server/db/tags";
import { PRIVATE_SUPABASE_SECRET_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { createFullLink, deleteLinks, updateLink} from "$lib/server/db/links";
import { createCollection, updateCollection, deleteCollection } from "$lib/server/db/collections";
import * as z from "zod";

export const actions: Actions = {
  deleteTags: async ({ request, locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const formData = await request.formData();
    const tagIds = formData.getAll("id") as string[];

    if (tagIds.length === 0) return fail(400, { message: "No se proporcionaron IDs" });

    try {
      await deleteTags(user.id, tagIds);
      return { success: true };
    } catch (error) {
      console.error("Error deleting tags:", error);
      return fail(500, { message: "Error al eliminar" });
    }
  },

  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    throw redirect(303, "/");
  },

  deleteAccount: async ({ locals: { supabase, safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SECRET_KEY);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting account:", error);
      return fail(500, { message: "No se pudo eliminar" });
    }

    await supabase.auth.signOut();
    throw redirect(303, "/");
  },

  createTag: async ({ request, locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const data = await request.formData();
    const tag = data.get('tag') as string;
    if (!tag || tag.trim() === '') return fail(400, { message: "Nombre vacío" });

    try {
      const [newTag] = await createTag(tag.trim(), user.id);
      return { success: true, tag: newTag };
    } catch (error: any) {
      if (error.code === '23505' || error.cause?.code === '23505') {
        return fail(400, { message: "Ya tenés un tag con ese nombre" });
      }
      return fail(500, { message: "Error interno" });
    }
  },

  createLink: async({ request, locals: { safeGetSession } })=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const data = await request.formData();
    const linkSchema = z.object({
      url: z.string().url(),
      title: z.string().min(1),
      description: z.string().optional(),
      faviconUrl: z.string().optional(),
      domain: z.string().optional()
    });

    try {
      const collections = data.getAll('collections') as string[];
      const tags = data.getAll('tags') as string[];
      
      const payload = {
        url: data.get('url'),
        title: data.get('title'),
        description: data.get('description'),
        faviconUrl: data.get('faviconUrl'),
        domain: data.get('domain')
      };

      const result = linkSchema.safeParse(payload);
      if (!result.success) return fail(400, { errors: result.error.flatten() });

      await createFullLink(user.id, result.data, tags, collections);
      return { success: true };
    } catch (error) {
      console.error("Error creating link:", error);
      return fail(500, { message: "Error al crear el link" });
    }
  },

  deletelinks: async({ request, locals: { safeGetSession } })=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    try {
      const data = await request.formData();
      const linkIds = data.getAll('id') as string[];
      
      if (linkIds.length === 0) return fail(400, { message: "No hay IDs para borrar" });

      await deleteLinks(user.id, linkIds);
      return { success: true };
    } catch (error) {
      console.error("Error deleting links:", error);
      return fail(500, { message: "Error al eliminar los links" });
    }
  },

  createCollection: async ({request, locals: {safeGetSession}})=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const collectionSchema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      isPublic: z.boolean(),
    });
    try{
      const data = await request.formData();
      const linkIds = data.getAll('link') as string[];
      
      const payload = {
        name: data.get('name'),
        description: data.get('description'),
        isPublic: data.get('isPublic') === 'on'? true: false,
      };

      const result = collectionSchema.safeParse(payload)
      if (!result.success) return fail(400, { errors: result.error.flatten() });

      await createCollection(user.id, result.data, linkIds)
     
      return { success: true }; 
    }catch(error){
      console.error(error)
      return fail(500, { message: "Error al crear la colección" });
    }
  },

  updateCollection: async ({request, locals: {safeGetSession}})=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    const collectionSchema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      isPublic: z.boolean(),
    });

    try{
      const data = await request.formData();
      const collectionId = data.get('id') as string;
      const linkIds = data.getAll('link') as string[];
      
      const payload = {
        name: data.get('name'),
        description: data.get('description'),
        isPublic: data.get('isPublic') === 'on'? true: false,
      };

      const result = collectionSchema.safeParse(payload)
      if (!result.success) return fail(400, { errors: result.error.flatten() });

      await updateCollection(user.id, collectionId, result.data, linkIds)
     
      return { success: true }; 
    }catch(error){
      console.error(error)
      return fail(500, { message: "Error al actualizar la colección" });
    }
  },

  deleteCollection: async ({request, locals: {safeGetSession}})=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });

    try{
      const data = await request.formData();
      const collectionId = data.get('id') as string;
      
      if (!collectionId) return fail(400, { message: "No se proporcionó el ID de la colección" });

      await deleteCollection(user.id, collectionId)
     
      return { success: true }; 
    }catch(error){
      console.error(error)
      return fail(500, { message: "Error al eliminar la colección" });
    }
  },

  updateLink: async({ request, locals: { safeGetSession } })=>{
    const { user } = await safeGetSession();
    if (!user) return fail(401, { message: "No autorizado" });
    
    const data = await request.formData();
    const linkSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    });
    
    try {
      const tags = data.getAll('tags') as string[];
      const linkId = data.get('id') as string
      const payload = {
        title: data.get('titulo'),
        description: data.get('description'),
      };

      const result = linkSchema.safeParse(payload);
      if (!result.success) return fail(400, { errors: result.error.flatten() });

      await updateLink(user.id, linkId, result.data, tags);
      return { success: true };
    } catch (error) {
      console.error("Error updating link:", error);
      return fail(500, { message: "Error al actualizar el link" });
    }
  },
};