import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!email || !password) {
			return fail(400, { error: 'Por favor, completá todos los campos.', email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Las contraseñas no coinciden.', email });
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback?next=/dashboard`
			}
		});

		if (error) {
			// Captura errores como "User already registered" o "Password too short"
			return fail(400, { 
				error: error.message === 'User already registered' 
					? 'Este email ya está registrado.' 
					: error.message, 
				email 
			});
		}

		// Importante: Mandamos a una página que le diga que revise el mail
		throw redirect(303, `/auth/sign-up-sucess?email=${email}`);
	}
};
