import FifaPlayers from '../model/FifaPlayers';
import { DatabaseModel } from '../model/DatabaseModel';

// Mock do DatabaseModel
jest.mock('../model/DatabaseModel', () => {
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

describe('FifaPlayers', () => {
    const mockDatabase = new DatabaseModel().pool;

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Testes para listarPlayersCards
    describe('listarPlayersCards', () => {
        it('deve retornar uma lista de jogadores quando a query for bem-sucedida', async () => {
            const mockResult = {
                rows: [
                    {
                        playerid: 1,
                        playername: "Pelé",
                        foot: "Right",
                        playerposition: "CAM",
                        awr: "High",
                        dwr: "Med",
                        ovr: "98",
                        pac: "95",
                        sho: "96",
                        pas: "93",
                        dri: "96",
                        def: "60",
                        phy: "76",
                        sm: "5",
                        div: "NA",
                        pos: "NA",
                        han: "NA",
                        reff: "NA",
                        kic: "NA",
                        spd: "NA"
                    }
                ],
            };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockResult); // Mock do resultado esperado

            const result = await FifaPlayers.listarPlayersCards();
            expect(result).toEqual(mockResult.rows);
        });

        it('deve retornar uma mensagem de erro em caso de falha na query', async () => {
            (mockDatabase.query as jest.Mock).mockRejectedValue(new Error('Erro de conexão'));

            const result = await FifaPlayers.listarPlayersCards();
            expect(result).toBe('error, verifique os logs do servidor');
        });
    });

    // Testes para removerPlayerCard
    describe('removerPlayerCard', () => {
        it('deve retornar true quando o jogador for removido com sucesso', async () => {
            const mockDeleteResult = { rowCount: 1 };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockDeleteResult); // Mock de sucesso ao deletar

            const result = await FifaPlayers.removerPlayerCard(1);
            expect(result).toBe(true);
        });

        it('deve retornar false quando o jogador não for encontrado', async () => {
            const mockDeleteResult = { rowCount: 0 };
            (mockDatabase.query as jest.Mock).mockResolvedValue(mockDeleteResult); // Mock quando o jogador não é encontrado

            const result = await FifaPlayers.removerPlayerCard(2);
            expect(result).toBe(false);
        });

        it('deve retornar false e capturar erro em caso de falha na query', async () => {
            (mockDatabase.query as jest.Mock).mockRejectedValue(new Error('Erro ao deletar'));

            const result = await FifaPlayers.removerPlayerCard(1);
            expect(result).toBe(false);
        });
    });
});