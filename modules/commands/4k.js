module.exports.config = {
  name: "4k",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "Tiện Ích",
  usages: "[reply]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = require('axios').default;
  const isLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(args[0]);
  var linkUp = event.messageReply.attachments[0]?.url || (isLink ? args[0] : '');
  
  if (!linkUp) return api.sendMessage('Vui lòng reply bằng ảnh hoặc nhập liên kết ảnh!', event.threadID, event.messageID);

  try {
    const apiKey = 'HUNGDEV_1or4IcZG9j'; 
    const apiUrl = `https://www.hungdev.id.vn/ai/4k?apikey=${apiKey}&url=${encodeURIComponent(linkUp)}`;
    
    api.sendMessage("Đang làm nét ảnh!", event.threadID);

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.success && data.data) { 
      const imageResponse = await axios.get(data.data, { responseType: "arraybuffer" });
      fs.writeFileSync(__dirname + `/cache/netanh.png`, Buffer.from(imageResponse.data, "binary"));
      
      return api.sendMessage({
        body: `Ảnh của bạn đã được làm nét hoàn tất!`,
        attachment: fs.createReadStream(__dirname + `/cache/netanh.png`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/netanh.png`), event.messageID);
    } else {
      return api.sendMessage(`API Error: ${JSON.stringify(data)}`, event.threadID, event.messageID);
    }
    
  } catch (e) {
    return api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
  }
};
