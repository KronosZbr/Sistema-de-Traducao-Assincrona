const translationService = require('../services/translation.service');

class TranslationController {
  
  async create(req, res) {
    try {

      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'O parâmetro "text" é obrigatório.' });
      }

      const result = await translationService.createTranslation(text);
      
      return res.status(202).json(result);

    } catch (error) {
      console.error('[Controller] Erro ao criar tradução:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao criar a requisição.' });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const translation = await translationService.getTranslationById(id);
      if (!translation) {
        return res.status(404).json({ error: 'Tradução não encontrada.' });
      }
      return res.json(translation);

    } catch (error) {
        console.error('[Controller] Erro ao buscar tradução por ID:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar a requisição.' });
    }
  }
}

module.exports = new TranslationController();