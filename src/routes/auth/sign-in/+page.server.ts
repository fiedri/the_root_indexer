import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { 
				error: 'Por favor, completá todos los campos.',
				email 
			});
		}

		let result;
		try {
			result = await supabase.auth.signInWithPassword({ email, password });
		} catch (err) {
			console.error('Error fatal de conexión con Supabase:', err);
			return fail(500, { 
				error: 'Error de red: No se pudo contactar con Supabase. Reintentá en unos segundos.',
				email 
			});
		}

		const { error } = result;

		if (error) {
			// Errores comunes: "Invalid login credentials"
			return fail(400, { 
				error: error.message === 'Invalid login credentials' 
					? 'Email o contraseña incorrectos.' 
					: error.message, 
				email 
			});
		}

		throw redirect(303, '/dashboard');
	}
};
