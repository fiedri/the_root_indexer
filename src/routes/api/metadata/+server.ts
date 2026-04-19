import { json } from '@sveltejs/kit';
import { getMetadata } from '$lib/utils/metadataUrl';
import type { RequestHandler } from './$types';


const serverCache = new Map();

export const GET: RequestHandler = async ({ url }) => {
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return json({ error: 'Falta la URL' }, { status: 400 });
    }

    
    if (serverCache.has(targetUrl)) {
        return json(serverCache.get(targetUrl));
    }

    try {
        const metadata = await getMetadata(targetUrl);
        
        if (metadata) {
            
            serverCache.set(targetUrl, metadata);
            
          
            if (serverCache.size > 100) serverCache.clear();
        }

        return json(metadata);
    } catch (error) {
        return json({ error: 'Error al obtener metadata' }, { status: 500 });
    }
};
