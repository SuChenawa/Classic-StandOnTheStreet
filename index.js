// 站街（洇岚版
const moduleName = "StandOnTheStreet";

const $ = process.env.ENV == 'dev' ? require('./emulators/base') : require('../base');

const path = require('path');
const s2t = require('chinese-s2t');

const stand = require('./stand');
const info = require('./info');
const rank = require('./rank');

/**
 * 入口
 */
async function index(message) {
    
    if (message.type != 'GroupMessage') return;

    const { messageChain } = message;

    let msg = '';
    messageChain.forEach(e => {
        if (e.type == 'Plain') {
            msg += e.text
        }
    })
    
    if (!msg.includes("站街")) return;

    msg = s2t.t2s(msg);
    
    if (msg == "关闭站街") {
        $.setModuleStatus(message, moduleName, 0);
    }
    if (msg == "开启站街") {
        $.setModuleStatus(message, moduleName, 1);
    }
    
    const status = await $.getModuleStatus(message, moduleName);
    if (!status) return;

    const timestamp = new Date();
    const ts = timestamp.getTime();
    const filePath = path.resolve(__dirname, `temp/${ts}.png`);

    if (msg == "站街") {
        stand(message, timestamp, filePath);
    }

    if (msg == "我的站街工资") {
        info(message, timestamp, filePath);
    }

    if (msg == "站街人气榜") {
        rank(message, timestamp, filePath, 'count');
    }
    if (msg == "站街富豪榜") {
        rank(message, timestamp, filePath, 'score');
    }
    if (msg == "站街赚钱榜") {
        rank(message, timestamp, filePath, 'make_score');
    }
    if (msg == "站街赔钱榜") {
        rank(message, timestamp, filePath, 'lose_score');
    }

}

module.exports = index;