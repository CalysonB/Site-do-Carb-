/**
 * Utilitário de Filtro de Conteúdo (Censura de Profanidades)
 * Focado em manter o decoro do site institucional.
 */

const BAD_WORDS = [
    // Lista básica de termos ofensivos em PT-BR (censurada no log para segurança)
    "porra", "caralho", "fodase", "foda-se", "foda", "merda", "puta",
    "arrombado", "cu", "viado", "fdp", "corno", "desgraçado", "idiota",
    "burro", "estupido", "vaca", "vagabundo", "pau", "cacete", "buceta"
];

/**
 * Censura palavras ofensivas em um texto, substituindo por asteriscos.
 * @param {string} text Texto a ser analisado
 * @returns {string} Texto sanitizado
 */
function sanitizeContent(text) {
    if (!text || typeof text !== 'string') return text;

    let sanitized = text;
    BAD_WORDS.forEach(word => {
        // Regex para encontrar a palavra insensível a maiúsculas/minúsculas 
        // e garantindo que seja a palavra inteira (\b)
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        sanitized = sanitized.replace(regex, (match) => {
            return match[0] + "*".repeat(match.length - 1);
        });
    });

    return sanitized;
}

module.exports = { sanitizeContent };
