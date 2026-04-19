import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, NODE_ENV } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return event.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        /**
         * Note: You have to add the `path` variable to the
         * set and remove method due to sveltekit's cookie API
         * requiring this to be set, setting the path to an empty string
         * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
         */
        cookiesToSet.forEach(({ name, value, options }) => 
          event.cookies.set(name, value, { ...options, path: '/', secure: NODE_ENV != 'development' })
        )
        if (headers) {
          Object.entries(headers).forEach(([name, value]) => {
            if (value && !['cache-control', 'expires', 'pragma'].includes(name.toLowerCase())) {
              try {
                event.setHeaders({ [name]: value });
              } catch (e) {
                // Si ya está seteado, SvelteKit tira error. Lo ignoramos para que no muera la app.
              }
            }
          });
        }
      },
    },
  })

  
  let cachedSession: { session: any, user: any } | null = null;

  event.locals.safeGetSession = async () => {
    if (cachedSession) return cachedSession;

    try {
      const { data: { user }, error } = await event.locals.supabase.auth.getUser();

      if (error || !user) {
        cachedSession = { session: null, user: null };
        return cachedSession;
      }

      const { data: { session } } = await event.locals.supabase.auth.getSession();
      cachedSession = { session, user };
      return cachedSession;
    } catch (err) {
      console.error('Supabase auth error (likely network/timeout):', err);
      cachedSession = { session: null, user: null };
      return cachedSession;
    }
  };

  // ELIMINAMOS EL AWAIT DE AQUÍ PARA NO BLOQUEAR LA RESPUESTA
  // event.locals.user lo manejaremos en los load si es necesario o lo dejamos como getter
  
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}