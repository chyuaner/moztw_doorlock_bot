require('dotenv').config();
// const { Bot } = require("grammy");
// const { run } = require("@grammyjs/runner");
const { Telegraf } = require('telegraf')

let telegram_api_key = process.env["TELEGRAM_BOT"]
let allow_chat_ids = process.env["ALLOW_CHAT_ID"].split(',');
let allow_usernames = process.env["ALLOW_USERNAME"].split(',');
let sesame_id      = process.env["SESAME_ID"]  // uuid
let key_secret_hex = process.env["KEY_SECRET_HEX"]
let api_key        = process.env["API_KEY"]

/**
 * 檢查是否授權開門
 * @return bool 1:授權開門 0:未授權
 */
function checkFrom(ctx) {
    let callChatId = ctx.chat.id;
    let callUsername = ctx.from.username;
    
    // 不允許的聊天室
    if (!allow_chat_ids.includes(callChatId.toString())) {
        return false;
    }
    // 不允許的使用者
    else if (!allow_usernames.includes(callUsername)){
        return false;
    }
    else {
        return true;
    }
}

// Create an instance of the `Bot` class and pass your bot token to it.
// const bot = new Bot(telegram_api_key); // <-- put your bot token between the ""
const bot = new Telegraf(telegram_api_key); // <-- put your bot token between the ""

// bot.command("help" /* , ... */);


bot.command(["opendoor", "dooropen"], (ctx) => {
    let isAllow = checkFrom(ctx);

    if (isAllow) {
        // TODO; 開門
        
    } else {
        ctx.reply("非請勿入！")
    }
});

bot.command(["doorstatus"], (ctx) => {
    let isAllow = checkFrom(ctx);

    if (isAllow) {
        // TODO; 取得門鎖狀態   
    } else {
        ctx.reply("非請勿入！")
    }
});


bot.command("debug", (ctx) => {
    // console.log(ctx.from);
    // console.log(ctx.chat);

    let callchatId = ctx.chat.id;
    let callchatTitle = ctx.chat.title;
    let callUserId = ctx.from.id;
    let callUsername = ctx.from.username;

    let isallow = checkFrom(ctx);

    let sendText = "<b>Debug資訊:</b> \n"
        +"chat.id: "+callchatId.toString()+"\n"
        +"chat.title: "+callchatTitle+"\n"
        +"from.id: "+callUserId.toString()+"\n"
        +"from.username: "+callUsername+"\n"
        +"isAllow:"+isallow;

    // Send the reply.
    ctx.replyWithHTML(sendText)
});

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("這不是門神能處理的事～"));


bot.launch().catch(err => {
	colsole.log(err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
