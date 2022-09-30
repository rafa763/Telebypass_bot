const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 3000;
const token = process.env.TOKEN;
const app = express();
app.use(bodyParser.json());

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    const caption = msg.caption;

    // grab the link from the message
    const urlRegex = /(https?:\/\/[^ \\\n]*)/;
    let url;
    if (message) {
        url = message.match(urlRegex);
    } else if (caption) {
        url = caption.match(urlRegex);
    }

  // send a message to the chat acknowledging receipt of their message
    if (url) {
        try {
            // bypass the graped link using the bypass api
            const passed = await axios.get(`https://bypass.pm/bypass2?url=${url[1]}`);
            bot.sendMessage(chatId, passed.data.destination);
        } catch (error) {
            bot.sendMessage(chatId, "Error, I can only bypass Linkvertise links");
        }  
    }
    else if (url === null) {
        bot.sendMessage(chatId, "Couldn't find a URL in your message");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});