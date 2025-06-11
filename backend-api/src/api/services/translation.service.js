const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib');
const pool = require('../config/db');

const WORK_QUEUE = 'translation_queue';

class TranslationService {
  async createTranslation(text) {
    const requestId = uuidv4();
    const targetLanguage = 'pt';

    await pool.query(
      `INSERT INTO translations (request_id, original_text, target_language, status) VALUES ($1, $2, $3, 'queued')`,
      [requestId, text, targetLanguage]
    );

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(WORK_QUEUE, { durable: true });
    channel.sendToQueue(WORK_QUEUE, Buffer.from(requestId), { persistent: true });
    await channel.close();
    await connection.close();

    return { requestId };
  }

  async getTranslationById(id) {
    const result = await pool.query('SELECT * FROM translations WHERE request_id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new TranslationService();