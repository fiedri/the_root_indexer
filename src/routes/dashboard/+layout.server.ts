import type { LayoutServerLoad } from './$types';
import { getTags } from '$lib/server/db/tags';
import { getCollections, getAllCollectionLinks } from '$lib/server/db/collections';
import { getlinksWithTags } from '$lib/server/db/links';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, setHeaders }) => {
    // IMPORTANTE: No usamos 'await' aquí para permitir el streaming (skeleton UI)
    const sessionPromise = safeGetSession();

    // Desactivamos el cache para que los datos siempre sean frescos
    setHeaders({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });

    const getData = async () => {
        const { user } = await sessionPromise;
        
        // Si no hay usuario, devolvemos null y el cliente redirigirá
        if (!user) return null;

        const [tags, collections, links, relations] = await Promise.all([
            getTags(user.id),
            getCollections(user.id),
            getlinksWithTags(user.id),
            getAllCollectionLinks(user.id)
        ]);
        
        return { tags, collections, links, relations, user };
    };

    return {
        streamed: getData() // Se envía como promesa (streaming)
    };
};