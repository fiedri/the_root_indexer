import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async({url, locals:{supabase}})=>{
    const code = url.searchParams.get('code')

    const next = url.searchParams.get('next') ?? '/dashboard';

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            
            throw redirect(303, next);
        }
        console.error('Error al canjear el código:', error.message);
    }
    throw redirect(303, '/auth/auth-code-error');

}