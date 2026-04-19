import type { PageServerLoad } from './$types';
import { getCollectionWithLinksById } from '$lib/server/db/collections';

export const load: PageServerLoad = async ({ params, locals: { safeGetSession }, setHeaders }) => {
    const { id } = params;

    setHeaders({
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600'
    });

    // Función asíncrona que envuelve todo lo que tarda (Auth + DB)
    const fetchPublicData = async () => {
        try {
            // No bloqueamos el load esperando la sesión
            const { user } = await safeGetSession();
            const userId = user?.id;

            if (!id) throw new Error("ID de colección no proporcionado");

            const collection = await getCollectionWithLinksById(id, userId);
            
            if (!collection) return null;
            return collection;
        } catch (error) {
            console.error("Error fetching public collection:", error);
            return null;
        }
    };

    return {
        streamed: fetchPublicData()
    };
};
