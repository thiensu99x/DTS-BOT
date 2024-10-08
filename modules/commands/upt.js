const axios = require('axios');

module.exports.config = {
    name: "upt",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "Hphong",
    description: "no prefix",
    commandCategory: "Tiện ích",
    usages: "Tiện ích",
    cooldowns: 0
};

async function downloadVideo(url) {
    try {
        const response = await axios({
            url: url,
            responseType: 'stream'
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading video:", error);
        throw error;
    }
}

module.exports.run = async ({ api, event }) => {
    const moment = require("moment-timezone");
    const os = require("os");
    const cpus = os.cpus();
    const timeStart = Date.now();
    const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
    
    const time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);
    
    const xuly = Math.floor((Date.now() - global.client.timeStart) / 4444);
    const trinhtrang = xuly < 10 ? "Tốt ✔️" : (xuly < 100 ? "Ổn định 📊" : "Delay 🐢");
    const api_url = 'http://dongdev.click/api/vdgai';

    try {
        const videoData = await axios.get(api_url);
        const videoUrl = videoData.data.url;
        const videoStream = await downloadVideo(videoUrl);

        const msg = {
            body: ` ⏰𝗧𝗶𝗺𝗲: ${timeNow}\n⏳𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝗼𝗻𝗹: ${hours}:${minutes}:${seconds}\n🤖𝗣𝗿𝗲𝗳𝗶𝘅 𝗛𝗲̣̂ 𝗧𝗵𝗼̂́𝗻𝗴: ${global.config.PREFIX}\n⚙️𝗧𝗶̀𝗻𝗵 𝘁𝗿𝗮̣𝗻𝗴: ${trinhtrang}\n⏲️𝗧𝗼̂́𝗰 đ𝗼̣̂ 𝘅𝘂̛̉ 𝗹𝘆́: ${xuly} 𝗴𝗶𝗮̂𝘆\n⏳𝐏𝐢𝐧𝐠: ${Date.now() - timeStart}ms`,
            attachment: videoStream
        };

        api.sendMessage(msg, event.threadID, (err, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
            });
        }, event.messageID);

    } catch (error) {
        console.error("Error processing video:", error);
        api.sendMessage("Có lỗi xảy ra khi tải video.", event.threadID, event.messageID);
    }
};
