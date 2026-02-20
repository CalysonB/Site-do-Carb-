const { sanitizeContent } = require('../utils/contentFilter');

describe('Content Filter (Sanitize Content)', () => {
    test('deve censurar palavras ofensivas conhecidas', () => {
        const input = "Este cara é um arrombado e disse porra";
        const output = sanitizeContent(input);
        expect(output).toContain("a********");
        expect(output).toContain("p****");
    });

    test('deve ser insensível a maiúsculas/minúsculas', () => {
        const input = "PORRA, que MERDA";
        const output = sanitizeContent(input);
        expect(output.toLowerCase()).toContain("p****");
        expect(output.toLowerCase()).toContain("m****");
    });

    test('deve manter palavras que não são ofensivas', () => {
        const input = "O sol está bonito hoje";
        const output = sanitizeContent(input);
        expect(output).toBe(input);
    });

    test('deve lidar com entradas vazias ou nulas', () => {
        expect(sanitizeContent("")).toBe("");
        expect(sanitizeContent(null)).toBe(null);
        expect(sanitizeContent(undefined)).toBe(undefined);
    });

    test('deve censurar apenas palavras inteiras (boundary)', () => {
        const input = "Acumular pontos não é porra"; // 'cu' está dentro de Acumular
        const output = sanitizeContent(input);
        expect(output).toContain("Acumular");
        expect(output).toContain("p****");
    });
});
