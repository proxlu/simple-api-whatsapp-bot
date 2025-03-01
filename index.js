const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const axios = require('axios'); // Adicionado para fazer requisições HTTP

// Criação da aplicação Express
const app = express();
app.use(express.json());

// URL do webhook (substitua pela URL do seu n8n, Node-RED, etc.)
const WEBHOOK_URL = 'https://seu-webhook.com/endpoint';

// Inicializa o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),  // Usa LocalAuth para manter a sessão
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Configuração do Puppeteer para não usar sandbox
    }
});

// Exibe o QR Code no terminal para login
client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo para conectar:');
    qrcode.generate(qr, { small: true }); // Gera o QR Code no terminal
});

// Mensagem quando o bot estiver pronto
client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para uso!');
});

// Endpoint para enviar mensagens via API
app.post('/send', async (req, res) => {
    const { number, message } = req.body;

    // Verifica se o número e a mensagem foram passados corretamente
    if (!number || !message) {
        return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
    }

    // Verifica se o cliente está pronto antes de tentar enviar a mensagem
    if (!client.info || !client.info.wid) {
        return res.status(500).json({ error: "O cliente do WhatsApp ainda não está pronto." });
    }

    try {
        // Formata o número para o formato correto
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: `Mensagem enviada para ${number}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar mensagem', details: error.message });
    }
});

// Função para enviar mensagens recebidas para o webhook
const sendToWebhook = async (data) => {
    try {
        const response = await axios.post(WEBHOOK_URL, data);
        console.log('Mensagem enviada para o webhook:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem para o webhook:', error.message);
    }
};

// Endpoint para receber mensagens recebidas
client.on('message', (msg) => {
    console.log(`📩 Nova mensagem de ${msg.from}: ${msg.body}`);

    // Envia a mensagem recebida para o webhook
    const messageData = {
        from: msg.from,
        body: msg.body,
        timestamp: msg.timestamp,
        type: msg.type
    };
    sendToWebhook(messageData);
});

// Inicia o servidor Express
const PORT = 3000;
const ADRESS = '0.0.0.0';
app.listen(PORT, ADRESS, () => {
    console.log(`Servidor rodando em http://${ADRESS}:${PORT}`);
});

// Inicializa o cliente do WhatsApp
client.initialize();
