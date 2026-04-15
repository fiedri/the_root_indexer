import { fail } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";

export const actions: Actions= {
    resend: async({url, locals:{supabase}})=>{
        const email = url.searchParams.get('email')
        if(!email){
            return fail(400, { error: 'No se encontró el email para el reenvío.' });

        }
        const {error} = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback?next=/dashboard`
            }
        })
        if (error){
            return fail(400, {error: error.message})
        }

        return {success: true}
    }}