import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTags } from '$lib/server/db/tags';
import { getCollections } from '$lib/server/db/collections';
import { getlinksWithTags } from '$lib/server/db/links';
export const load: PageServerLoad = async ({locals: { supabase }}) => {
    try{
        const {data} = await supabase.auth.getUser();
        
        if(!data.user?.id) {
            throw redirect(303, '/auth/sign-in');
        }
        const tags = await getTags(data.user.id);
        const collections = await getCollections(data.user.id);
        let links = await getlinksWithTags(data.user.id);
        if(!links){
            links = [];
        }
        return {
            tags,
            collections,
            links
        }
    }catch(err){
        console.error('Error fetching session:', err);
        throw redirect(303, '/auth/sign-in');
    }
};