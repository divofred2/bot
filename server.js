const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  const lowerMessage = message.body.toLowerCase();
  if (lowerMessage.includes('set')) {
    let setting = lowerMessage.split(' ');
    console.log(setting);
  } else {
    if (lowerMessage.includes('btc') || lowerMessage.includes('bitcoin')) {
      message.reply('Current bitcoin rate is $29,154.00');
    }
    if (lowerMessage.includes('Hello')) {
      message.reply('Hi');
    }
    if (lowerMessage.includes('eth') || lowerMessage.includes('ethereum')) {
      message.reply('Current ethereum rate is $1,971.97');
    }
  }
});
client.initialize();
