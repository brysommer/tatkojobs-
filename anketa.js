import { bot } from "./app.js";

export const anketaListiner = async () => {
    bot.on('callback_query', async (query) => {
        const callback = query.data;
        const chatId = query.message.chat.id;
    });

    bot.on('message', async (msg) => {
        let chatId = msg.chat.id;
        const text = msg.text; 
        if (msg.contact) {
            customerPhone = msg.contact.phone_number;
            customerName = msg.contact.first_name;
        }
    })
}

