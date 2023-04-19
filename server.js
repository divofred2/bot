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
let btc;
let eth;
client.on('message', message => {
  const lowerMessage = message.body.toLowerCase();
  if (lowerMessage.includes('set')) {
    let setting = lowerMessage.split(' ');
    let sto = setting[1];
    let val = setting[3];

    if (sto == 'eth') {
      eth = val;
      console.log(eth);
    }
    if (sto === 'btc') {
      btc = val;
      console.log(btc);
    }
  } else {
    if (lowerMessage.includes('btc') || lowerMessage.includes('bitcoin')) {
      message.reply(`Current bitcoin rate is ${btc}`);
    }
    if (lowerMessage.includes('hello')) {
      message.reply('Hi');
    }
    if (lowerMessage.includes('eth') || lowerMessage.includes('ethereum')) {
      message.reply(`Current ethereum rate is ${eth}`);
    }
  }
});
client.initialize();
