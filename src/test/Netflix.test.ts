import Netflix from '../model/Netflix';
import { DatabaseModel } from '../model/DatabaseModel';

// Jest.mock para o DatabaseModel
jest.mock('../model/DatabaseModel', () => {
    // Definir o mockQuery dentro do mock
    const mockQuery = jest.fn(); // Mock da função query
    return {
        DatabaseModel: jest.fn().mockImplementation(() => ({
            pool: {
                query: mockQuery, // Atribuindo o mockQuery à função query
            },
        })),
        mockQuery, // Exportar o mockQuery para ser usado nos testes
    };
});

describe('Netflix', () => {
    const mockDatabase = new DatabaseModel().pool;

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Testes para listarNetflixTitles
    describe('listarNetflixTitles', () => {
        it('deve retornar uma lista de títulos quando a query for bem-sucedida', async () => {
            const mockResult = {
                rows: [
                    {
                        show_id: "s1",
                        tipo: "Movie",
                        titulo: "Dick Johnson Is Dead",
                        diretor: "Kirsten Johnson",
                        elenco: null,
                        pais: "United States",
                        adicionado: "September 25, 2021",
                        ano_lancamento: 2020,
                        classificacao: "PG-13",
                        duracao: "90 min",
                        listado_em: "Documentaries",
                        descricao: "As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable."
                    }
                ],
            };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockResult); // Mock do resultado esperado

            const result = await Netflix.listarNetflixTitles();
            expect(result).toEqual(mockResult.rows);
        });

        it('deve retornar uma mensagem de erro em caso de falha', async () => {
            (mockDatabase.query as jest.Mock).mockRejectedValue(new Error('Erro de conexão'));

            const result = await Netflix.listarNetflixTitles();
            expect(result).toBe('error, verifique os logs do servidor');
        });
    });

    // Testes para removerNetflixTitle
    describe('removerNetflixTitle', () => {
        it('deve retornar true quando o título for removido com sucesso', async () => {
            const mockDeleteResult = { rowCount: 1 };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockDeleteResult); // Mock de sucesso ao deletar

            const result = await Netflix.removerNetflixTitle('s1');
            expect(result).toBe(true);
        });

        it('deve retornar false quando o título não for encontrado', async () => {
            const mockDeleteResult = { rowCount: 0 };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockDeleteResult); // Mock quando nenhum título é encontrado

            const result = await Netflix.removerNetflixTitle('s2');
            expect(result).toBe(false);
        });

        it('deve retornar false e capturar erro em caso de falha', async () => {
            (mockDatabase.query as jest.Mock).mockRejectedValue(new Error('Erro ao deletar'));

            const result = await Netflix.removerNetflixTitle('s1');
            expect(result).toBe(false);
        });
    });
});