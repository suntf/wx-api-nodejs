exports.textMessage = function(message){
    var createTime = new Date().getTime()
    return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${message.reply}]]></Content>
    </xml>`
}

exports.imageMessage = function(message){
    var createTime = new Date().getTime()
    return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[image]]></MsgType>
    <Image>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
    </Image>
    </xml>`
}

exports.voiceMessage = function(message){
    var createTime = new Date().getTime()
    return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[voice]]></MsgType>
    <Voice>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
    </Voice>
    </xml>`
}

exports.videoMessage = function(message){
    var createTime = new Date().getTime()
    return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[video]]></MsgType>
    <Video>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
        <Title><![CDATA[${message.title}]]></Title>
        <Description><![CDATA[${message.description}]]></Description>
    </Video>
    </xml>`
}

exports.articleMessage = function(message){
    var createTime = new Date().getTime()
    return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <ArticleCount>${message.articles.length}</ArticleCount>
    <Articles>
        ${message.articles.map(article => 
            `<item><Title><![CDATA[${article.title}]]></Title>
                <Description><![CDATA[${article.description}]]></Description>
                <PicUrl><![CDATA[${article.img}]]></PicUrl>
                <Url><![CDATA[${article.url}]]></Url></item>`
        ).join('')}
    </Articles>
    </xml>`
}