var xml2js = require('xml2js')

exports.formatMessage = function(xml) {
    return new Promise((resolve, reject) => {
        
        // 接收文本信息格式
        // <xml> <ToUserName><![CDATA[toUser]]></ToUserName>
        // <FromUserName><![CDATA[fromUser]]></FromUserName>
        // <CreateTime>1348831860</CreateTime>
        // <MsgType><![CDATA[text]]></MsgType>
        // <Content><![CDATA[this is a test]]></Content>
        // <MsgId>1234567890123456</MsgId></xml>

        xml2js.parseString(xml, function(err, content) {
            var result = content.xml
            var message = {};
            if (typeof result === 'object') {
                var keys = Object.keys(result);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var item = result[key];
                    if (!(item instanceof Array) || item.length === 0) continue;
                    if (item.length === 1) {
                        var val = item[0];
                        if (typeof val === 'object') message[key] = formatMessage(val);
                        else message[key] = (val || '').trim();
                    } else {
                        message[key] = [];
                        for (var j = 0, k = item.length; j < k; j++) message[key].push(formatMessage(item[j]));
                    }
                }
            }
            resolve(message)
        })
    })
}