require('dotenv').config();
const { Pool } = require('pg');
const amqp = require('amqplib');
const { translate } = require('@vitalets/google-translate-api');

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, RABBITMQ_URL } = process.env;
const WORK_QUEUE = 'translation_queue';

const pool = new Pool({ user: DB_USER, host: DB_HOST, database: DB_DATABASE, password: DB_PASSWORD, port: DB_PORT });

async function processMessage(msg) {
    const requestId = msg.content.toString();
    console.log(`[Worker] Recebida requisição para processar: ${requestId}`);

    try {
        await pool.query(`UPDATE translations SET status = 'processing', updated_at = NOW() WHERE request_id = $1`, [requestId]);
        
        const res = await pool.query('SELECT original_text, target_language FROM translations WHERE request_id = $1', [requestId]);
        const { original_text, target_language } = res.rows[0];

        const translationResult = await translate(original_text, { to: target_language });
        
        const translatedText = translationResult.text;
        
        const detectedSourceLanguage = translationResult.raw.src || 'auto';

        await pool.query(
            `UPDATE translations SET status = 'completed', translated_text = $1, detected_source_language = $2, updated_at = NOW() WHERE request_id = $3`,
            [translatedText, detectedSourceLanguage, requestId]
        );
        
        console.log(`[Worker] Tradução de ${requestId} concluída e salva no banco. Idioma de origem: ${detectedSourceLanguage}.`);

    } catch (error) {
        console.error(`[Worker] ERRO ao processar a requisição ${requestId}:`, error.message);
        await pool.query(`UPDATE translations SET status = 'failed', updated_at = NOW() WHERE request_id = $1`, [requestId]);
    }
}

async function startWorker() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(WORK_QUEUE, { durable: true });
        channel.prefetch(1);
        console.log(`[Worker] Worker (Polling) iniciado. Aguardando mensagens na fila: ${WORK_QUEUE}.`);
        channel.consume(WORK_QUEUE, async (msg) => {
            if (msg !== null) { 
                await processMessage(msg); 
                channel.ack(msg); 
            }
        });
    } catch(error) {
        console.error("[Worker] FALHA CRÍTICA AO INICIAR.", error.message);
        setTimeout(startWorker, 10000);
    }
}

startWorker();