const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { parseString } = require('xml2js');
var getRawBody = require('raw-body');
var contentType = require('content-type');
var utils = require('./utils');
var template = require('./template');
var wechat = require("./wechat");

app.use('/wx', (req, res) => {
  if(req.query.echostr != null) {
    res.send(req.query.echostr);
    return;
  }

  var data = getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(req).parameters.charset
  }, function(err, buf) {
    if (err) return next(err)
    utils.formatMessage(buf.toString()).then(message => {
        if (message.MsgType == 'event') {
            if (message.Event === 'subscribe') {
                if (message.EventKey) {
                    console.log('扫描二维码关注：' + message.EventKey + ' ' + message.ticket);
                }
                message.reply = '终于等到你，还好我没放弃' + '\n' + wechat.textMessageMoYu();
            } else if (message.Event === 'unsubscribe') {
                message.reply = '';
                console.log(message.FromUserName + ' 悄悄地走了...');
            } else if (message.Event === 'LOCATION') {
                message.reply = '您上报的地理位置是：' + message.Latitude + ',' + message.Longitude;
            } else if (message.Event === 'CLICK') {
                message.reply = '您点击了菜单：' + message.EventKey;
            } else if (message.Event === 'SCAN') {
                message.reply = '关注后扫描二维码：' + message.Ticket;
            }
            res.send(template.textMessage(message))
        } else if (message.MsgType === 'text') {
            var content = message.Content
            if (content === '1') {
                message.reply = '终于等到你'
                res.send(template.textMessage(message))
            } else if (content === '2') {
                message.mediaId = 'sVxPDxIx18Li7E4Thlk5TZhmta3QuZEO7FBth-m0XqKLszCT6tAza8jrus-mcjsk'
                res.send(template.imageMessage(message))
            } else if (content === '3' || content === '外卖' || content === '红包') {
                message.articles = [{
                    title: '领 15 元的外卖红包',
                    description: '领 15 元的外卖红包',
                    picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/JdvrFAYicH4rAKMsCrxibsdKMjlFm2sibWE5Gk79mxPHrbCmStsNuibByxOw6JgFmXlcP3JUiaKca8zWVz8jZqNmJVA/0?wx_fmt=jpe',
                    url: 'https://mp.weixin.qq.com/s?__biz=MzA4MjExMzY3Nw==&mid=2453925686&idx=2&sn=400dd5efcc3fee2cd3f3997b2a99714d&chksm=883dead4bf4a63c287ed5030c3ed3a5c0fd51c92fbaa2f52fe5253c948fdb8a70ee6da2d2961&token=1428070581&lang=zh_CN#rd'
                }]
                res.send(template.articleMessage(message))
            } else {
                message.reply = wechat.textMessageMoYu();
                res.send(template.textMessage(message))
            }
        }

    })
})
 
});


app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(`/logo`, (req, res) => {
  const logo = path.join(__dirname, 'logo.png');
  const content = fs.readFileSync(logo, {
    encoding: 'base64',
  });
  res.set('Content-Type', 'image/png');
  res.send(Buffer.from(content, 'base64'));
  res.status(200).end();
});

app.get('/user', (req, res) => {
  res.send([
    {
      title: 'serverless framework',
      link: 'https://serverless.com',
    },
  ]);
});


app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  res.send({
    id: id,
    title: 'serverless framework',
    link: 'https://serverless.com',
  });
});

app.get('/404', (req, res) => {
  res.status(404).send('Not found');
});

app.get('/500', (req, res) => {
  res.status(500).send('Server Error');
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});


  function getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = ''
      req.on('data', data => {
        //
        console.log(data);
        xmlData += data.toString()
      })
        .on('end', () => {
          //当数据接收完毕，会触发当前函数
          resolve(xmlData)
        })
    })
  }
  function parseXMLAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { trim: true }, (err, data) => {
        if (!err) {
          resolve(data)
        } else {
          reject('parseXMLtoJS' + err)
        }
      })
    })
  }

  function formatMessage(jsData) {
    let message = {}
    //获取xml对象
    jsData = jsData.xml
    //判断是否是一个对象
    if (typeof jsData === 'object') {
      //遍历对象
      for (let key in jsData) {
        let value = jsData[key]
        if (Array.isArray(value) && value.length > 0) {
          message[key] = value[0]
        }
      }
    }
    return message
  }
