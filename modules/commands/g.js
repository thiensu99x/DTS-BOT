module.exports.config = {
    name: "g",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DTS",
    description: "Gemini Chat GPT4",
    commandCategory: "Tiện Ích",
    usages: "[Script]",
    cooldowns: 5,
    usePrefix: false,
};

const axios = require("axios");

async function chatGemini(query) {
    const url = `https://apitntxtrick.onlitegix.com/gemini?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url, {
        });

        // Kiểm tra và lấy phần text từ response
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            return "Xin lỗi, không có phản hồi từ Gemini.";
        }
    } catch (error) {
        console.error(error);
        return "Đã xảy ra lỗi khi trò chuyện với Gemini.";
    }
}

module.exports.run = async function ({
    api,
    event: e,
    args,
    Threads,
    Users,
    Currencies,
    models,
}) {
    try {
        var query =
            e.type === "message_reply"
                ? args.join(" ") + ' "' + e.messageReply.body + '"'
                : args.join(" ");

        var responseText = await chatGemini(query);

        return api.sendMessage(responseText, e.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Đã xảy ra lỗi khi gửi tin nhắn.", e.threadID);
    }
};

module.exports.handleReply = async function (o) {
    let query = o.event.body;

    let responseText = await chatGemini(query);

    o.api.sendMessage(
        responseText,
        o.event.threadID,
        (err, res) => {
            if (err) console.error(err);
        },
        o.event.messageID
    );
};
