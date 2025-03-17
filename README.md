# WhatsApp Bot com Webhook Integration

Este projeto é um bot para WhatsApp que utiliza a biblioteca `whatsapp-web.js` para enviar e receber mensagens. Ele também integra com webhooks, permitindo que mensagens recebidas sejam enviadas para um endpoint configurável (por exemplo, n8n, Node-RED ou outros sistemas).

## Funcionalidades

- **Autenticação via QR Code**: O bot gera um QR Code no terminal para autenticação no WhatsApp.
- **Envio de Mensagens**: Possui um endpoint `/send` para enviar mensagens via API.
- **Recebimento de Mensagens**: Captura mensagens recebidas e as envia para um webhook configurável.
- **Persistência de Sessão**: Usa `LocalAuth` para manter a sessão ativa após a primeira autenticação.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Uma conta no WhatsApp (não é suportado para contas de negócios)
- Um servidor ou serviço para receber webhooks (opcional)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/proxlu/simple-api-whatsapp.git
   cd whatsapp-bot-webhook
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o webhook:
   - Abra o arquivo `index.js` e substitua a constante `WEBHOOK_URL` pela URL do seu webhook (n8n, Node-RED, etc.).

4. Inicie o bot:
   ```bash
   node index.js
   ```

5. Escaneie o QR Code exibido no terminal para autenticar o bot no WhatsApp.

## Uso

### Enviar Mensagens via API

Faça uma requisição POST para o endpoint `/send` com o seguinte formato:

**URL**: `http://localhost:3000/send`

**Corpo da Requisição (JSON)**:
```json
{
    "number": "5511999999999",
    "message": "Olá, isso é uma mensagem de teste!"
}
```

**Resposta de Sucesso**:
```json
{
    "success": true,
    "message": "Mensagem enviada para 5511999999999"
}
```

### Receber Mensagens via Webhook

Quando o bot recebe uma mensagem, ele envia os dados para o webhook configurado. O formato dos dados é:

**Exemplo de Dados Enviados**:
```json
{
    "from": "5511999999999@c.us",
    "body": "Olá, tudo bem?",
    "timestamp": 1633032800,
    "type": "chat"
}
```

### Variáveis de Ambiente (Opcional)

Você pode configurar o webhook e a porta do servidor usando variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto:

```env
WEBHOOK_URL=https://seu-webhook.com/endpoint
PORT=3000
```

No código, use `process.env.WEBHOOK_URL` e `process.env.PORT` para acessar essas variáveis.

## Estrutura do Projeto

```
whatsapp-bot-webhook/
├── index.js          # Código principal do bot
├── package.json      # Dependências e scripts
├── README.md         # Documentação do projeto
└── .env              # Arquivo de variáveis de ambiente (opcional)
```

## Dependências

- `whatsapp-web.js`: Biblioteca para interagir com o WhatsApp.
- `express`: Framework para criar o servidor HTTP.
- `qrcode-terminal`: Exibe o QR Code no terminal.
- `axios`: Faz requisições HTTP para enviar dados ao webhook.

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a AGPL License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Dúvidas ou Problemas?

Se encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/proxlu/simple-api-whatsapp-bot/issues) no repositório.
