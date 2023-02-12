const qqLogin = require("./qqLogin");
const dynamicLoadModule = require("./dynamicLoadModule").dynamicLoadModule;
const events = require("./qqEventHandler").qqEvents;


function main() {
    process.on("unhandledRejection", (e) => {
        console.warn(e.message);
    })

    let qqEventHandler = dynamicLoadModule("./qqEventHandler.js").qqEventHandler;
    //动态加载qqEventHandler，实现QQ不下线的条件下修改处理代码
    setInterval(() => {
        try {
            qqEventHandler = dynamicLoadModule("./qqEventHandler.js").qqEventHandler;
        } catch (e) {
            console.warn(e.message);
        }
    }, 3000);

    //将message.private转换为onMessagePrivate
    function toCamelCase(str) {
        return ("on." + str).replace(/(\.\w)/g, (m) => m[1].toUpperCase());
    }

    qqLogin("qq_account", "qq_password")
        .then((client) => {
            for (let event of events) {
                client.on(event, async e => {
                    //如事件为message.group，则调用qqEventHandler.onMessageGroup(e)
                    await qqEventHandler?.[toCamelCase(event)]?.(client, e);
                });
            }
        })
        .catch(e => console.warn(e.message));
}

main();