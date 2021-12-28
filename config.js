//配置参数
config = {	
    token : 'wxTef17823334',
    appid : '你的公众号appid',
    appsecret :'你的公众号appsecret',
    apiDomain : 'https://api.weixin.qq.com/',
    accessTokenApi : '%scgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',
    userApi : '%scgi-bin/user/get?access_token=%s&next_openid='
}
module.exports = config   //暴露模块,才能在其它地方调用  