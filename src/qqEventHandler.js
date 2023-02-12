const {Configuration, OpenAIApi} = require("openai");

function getOpenAIReply(answer) {
    const openai = new OpenAIApi(new Configuration({apiKey: "openai_api_key"}));
    return openai
        .createCompletion({
            model: "text-davinci-003",
            prompt: answer,
            temperature: 0.6,
            max_tokens: 1024,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        })
        .then(reply => reply.data.choices[0].text)
        .catch(e => console.warn(e.message));
}

const getReply = (e, quote) => {
    return getOpenAIReply(e.raw_message)
        .then(reply => e.reply(reply, quote))
        .catch(e => console.warn(e.message));
}

const qqEventHandler = {
    async onMessagePrivate(client, e) {
        await getReply(e, false);
    },
    async onMessageGroup(client, e) {
        if (!e.atme || e.atall) {
            return;
        }
        await getReply(e, true);
    }
}

const qqEvents = [
    //收到二维码
    "system.login.qrcode",

    //滑动验证码
    "system.login.slider",

    //设备锁
    "system.login.device",

    //登录错误
    "system.login.error",

    //上线
    "system.online",

    //服务器踢下线
    "system.offline.kickoff",

    //网络错误导致下线
    "system.offline.network",

    //好友申请
    "request.friend",

    //加群申请
    "request.group.add",

    //群邀请
    "request.group.invite",

    //全部请求
    "request",

    //群消息
    "message.group",

    //私聊消息
    "message.private",

    //讨论组消息
    "message.discuss",

    //全部消息
    "message",

    //好友增加
    "notice.friend.increase",

    //好友减少
    "notice.friend.decrease",

    //好友撤回
    "notice.friend.recall",

    //好友戳一戳
    "notice.friend.poke",

    //好友通知
    "notice.friend",

    //群员增加
    "notice.group.increase",

    //群员减少
    "notice.group.decrease",

    //群撤回
    "notice.group.recall",

    //群戳一戳
    "notice.group.poke",

    //群禁言
    "notice.group.ban",

    //群管理变更
    "notice.group.admin",

    //群转让
    "notice.group.transfer",

    //群通知
    "notice.group",

    //全部通知
    "notice",

    //私聊消息同步
    "sync.message",

    //已读同步
    "sync.read",

    //频道消息
    "guild.message"
];

module.exports = {qqEventHandler, qqEvents};