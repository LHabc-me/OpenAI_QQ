const {createClient} = require("oicq");

//登录QQ
async function qqLogin(account, password) {
    //检查账号
    //仅传入account则扫码登录
    if (!account) {
        throw "QQ账号不能为空！";
    }

    /*
        Android = 1,
        aPad = 2,
        Watch = 3,
        iMac = 4,
        iPad = 5
     */
    const client = createClient(account, {platform: 3});

    await new Promise((resolve) => {
        for (const e of ["system.online", "system.login.error"]) {
            client.on(e, resolve);
        }

        client.on("system.login.device", () => {
            client.logger.mark("输入密保手机收到的短信验证码后按下回车键继续。");
            client.sendSmsCode();
            process.stdin.once("data", (input) => {
                client.submitSmsCode(input.toString());
                resolve();
            });
        });
        client.on("system.login.slider", () => {
            client.logger.mark("输入滑动验证码请求中的 ticket 后按下回车键继续。");
            process.stdin.once("data", (input) => {
                client.submitSlider(input.toString());
                resolve();
            });
        });
        client.on("system.login.qrcode", () => {
            client.logger.mark("手机扫码完成后按下回车键继续。");
            process.stdin.once("data", () => {
                client.login();
                resolve();
            });
        });
        client.login(password);
    });

    return client;
}

module.exports = qqLogin;