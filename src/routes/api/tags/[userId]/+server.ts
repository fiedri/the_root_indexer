import { error } from '@sveltejs/kit';
import * as tags from '$lib/server/db/tags'
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async({url}) => {
    try{
        const userId = url.searchParams.get('userId');
        if(!userId) {
            throw error(400, 'Missing userId parameter');
        }
        const tags = await tags.getTags(userId);
        return new Response(JSON.stringify(tags));
    } catch (err) {
        throw error(500, 'Failed to fetch tags');
    }
};