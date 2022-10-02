const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const Cache = require('./model');
const connect = require('./db');


const PORT = process.env.PORT || 3000;
const token = process.env.TOKEN;
const app = express();
app.use(express.json());
app.use(express.static("views"));
connect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'views/index.html');
});

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    const caption = msg.caption;
    const username = msg.from.username;

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
            // check if the url is cached
            const cached = await Cache.findOne({message: url[1]});
            if (cached) {
                bot.sendMessage(chatId, `Cache | ${cached.link}`);
                return;
            } else {
                // bypass the graped link using the bypass api
                const passed = await axios.get(`https://bypass.pm/bypass2?url=${url[1]}`);
                // cache the result
                const cache = new Cache({
                    user: username,
                    message: url[1],
                    link: passed.data.destination,
                });
                await cache.save();
                bot.sendMessage(chatId, `API | ${passed.data.destination}`);
                return;
            }
        } catch (error) {
            console.log(error);
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