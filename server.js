require('dotenv').config()
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const  {Configuration, OpenAIApi} = require('openai')

const config = new Configuration({
  apiKey: process.env.OPEN_AI_API
})
const openai = new OpenAIApi(config);

async function runCompletion(message){
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message,
    max_tokens: 100
  })
  return completion.data.choices[0].text
}
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
client.on('message', async message => {
  const mentions = await message.getMentions();
  const chat = await message.getChat();
  if(mentions[0]?.isMe || !chat.isGroup){
    const lowerMessage = message.body.toLowerCase();
    let lowerMessage1 = lowerMessage.split(' ')
    if (lowerMessage1[1] === "set") {
      //Use author for group chat
      if(message.from !== '2348126887684@c.us' && message.author !== "2348126887684@c.us"){
        return message.reply('Not Authorized to make this change')
      }
      let setting = lowerMessage.split(' ');
      let sto = setting[1];
      let val = setting[3];
  
      if (sto == 'eth') {
        eth = val;
      }
      if (sto === 'btc') {
        btc = val;
        
      }
    } else {
      if (lowerMessage.includes('btc') || lowerMessage.includes('bitcoin')) {
        return message.reply(`Current bitcoin rate is ${btc}`);
      }
      if (lowerMessage.includes('hello')) {
       return message.reply('Hi');
      }
      if (lowerMessage.includes('eth') || lowerMessage.includes('ethereum')) {
        return message.reply(`Current ethereum rate is ${eth}`);
      } if(message.body === '!everyone') {
        if (chat.isGroup){
          let text = "";
        let mentions = [];
    
        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }
    
        return await chat.sendMessage(text, { mentions });
  
        }else{
          return message.reply('Must be used in a group')
        }
    } else{
      runCompletion(message.body).then(result=> message.reply(result) );
    } 
    }
  }
 });
client.initialize();
