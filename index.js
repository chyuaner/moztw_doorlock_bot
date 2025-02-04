require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getDoorStatus, openDoor } = require('./doorlock');

let telegram_api_key = process.env["TELEGRAM_BOT"]
let is_force_allow_in_chat = Boolean(process.env["FORCE_ALLOW_IN_CHAT"]);
let allow_chat_ids = process.env["ALLOW_CHAT_ID"].split(',');
let allow_usernames = process.env["ALLOW_USERNAME"].split(',');

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
    // 不允許的使用者，而且也沒開強制聊天室內成員直接允許的話
    else if (!allow_usernames.includes(callUsername) & !is_force_allow_in_chat){
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
    let callUsername = ctx.from.username;
    let isAllow = checkFrom(ctx);

    if (isAllow) {
        // 開門
        // TODO: 待測試
        openDoor().then((res) => {
            // console.log(res.data);
            // ctx.reply(JSON.stringify(res.data, null, ' '));
            ctx.reply("@"+callUsername+" 已打開MozTW門(11樓)")
        })
        .catch((error) => {
            let status = error.response.status;
            let data = error.response.data;
            ctx.reply(status+"錯誤: "+data);
        });
    } else {
        ctx.reply("非請勿入！")
    }
});

bot.command(["doorstatus"], (ctx) => {
    let isAllow = checkFrom(ctx);

    if (isAllow) {
        // 取得門鎖狀態   
        getDoorStatus().then((res) => {
            // console.log(res.data);
            ctx.reply(JSON.stringify(res.data, null, ' '));

        })
        .catch((error) => {
            let status = error.response.status;
            let data = error.response.data;
            ctx.reply(status+"錯誤: "+data);
        });
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
