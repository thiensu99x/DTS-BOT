module.exports.config = {
    name: "vdgai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DTS",
    description: "Random video",
    commandCategory: "Video",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async ({ api, event, args, Users, Threads, Currencies }) => {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    // URL của API để lấy video
    const apiUrl = "https://apiquockhanh.click/video/videogai";

    // Lấy dữ liệu người dùng
    var data = await Currencies.getData(event.senderID);
    var money = data.money;

    // Kiểm tra số tiền trong tài khoản
    if (money < 500) {
        api.sendMessage("→ Bạn cần 500$ để xem video ?", event.threadID, event.messageID);
    } else {
        // Trừ tiền khỏi tài khoản của người dùng
        Currencies.setData(event.senderID, { money: money - 500 });

        try {
            // Lấy video từ API
            const response = await axios.get(apiUrl);
            // console.log("Phản hồi từ API:", response.data); // In ra phản hồi để kiểm tra

            const videoUrl = response.data.url; // Lấy URL từ trường "url"

            // Kiểm tra xem videoUrl có hợp lệ không
            if (!videoUrl) {
                throw new Error("Không tìm thấy URL video trong phản hồi từ API");
            }

            // Gửi tin nhắn kèm video
            const callback = () => api.sendMessage({
                body: `Video của bạn đây\n→ -500$ !`,
                attachment: fs.createReadStream(__dirname + "/cache/video.mp4")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/video.mp4"), event.messageID);

            // Tải video và lưu vào bộ nhớ cache
            const videoResponse = await axios({
                method: 'get',
                url: videoUrl,
                responseType: 'stream'
            });

            // Lưu video vào file hệ thống
            videoResponse.data.pipe(fs.createWriteStream(__dirname + "/cache/video.mp4")).on("finish", () => {
                callback();
            });

        } catch (error) {
            console.error(error);
            api.sendMessage("Lỗi khi tải video: " + error.message, event.threadID, event.messageID);
        }
    }
};
