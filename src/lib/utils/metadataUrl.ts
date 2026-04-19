import * as cheerio from "cheerio";

/**
 * Obtiene la metadata (título, descripción, favicon) de una URL.
 * IMPORTANTE: Esta función debe ejecutarse en el SERVIDOR debido a CORS.
 */
export const getMetadata = async (url: string) => {
    let urlObj: URL;
    
    try {
        urlObj = new URL(url);
    } catch (err) {
        console.error("URL inválida:", url);
        return null;
    }

    try {
        // Usamos fetch nativo (estándar en SvelteKit/Node moderno)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html',
                'Accept-Language': 'es-ES,es;q=0.9'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extracción con fallback priorizando OpenGraph (para redes sociales/sitios modernos)
        const title = 
            $('meta[property="og:title"]').attr('content') || 
            $('title').text() || 
            $('meta[name="twitter:title"]').attr('content') || 
            "";

        const description = 
            $('meta[property="og:description"]').attr('content') || 
            $('meta[name="description"]').attr('content') || 
            $('meta[name="twitter:description"]').attr('content') || 
            $('meta[itemprop="description"]').attr('content') ||
            "";

        // Lógica de Favicon con múltiples fallbacks
        let favicon = 
            $('link[rel="apple-touch-icon"]').attr('href') ||
            $('link[rel="icon"]').attr('href') || 
            $('link[rel="shortcut icon"]').attr('href') || 
            "/favicon.ico";

        if (favicon && !favicon.startsWith('http')) {
            favicon = new URL(favicon, urlObj.origin).href;
        }

        return {
            title: title.trim(),
            domain: urlObj.hostname.replace('www.', ""),
            description: description.trim(),
            favicon: favicon,
            url: url
        };

    } catch (error: any) {
        console.error(`Error scrapeando ${url}:`, error.message);
        
        return {
            title: urlObj.hostname,
            domain: urlObj.hostname,
            description: "",
            favicon: `${urlObj.origin}/favicon.ico`,
            url: url
        };
    }
};

