var Lunar = require('./calendar');
const crypto = require('crypto'), //引入加密模块
https = require('https'), //引入 htts 模块
util = require('util'), //引入 util 工具包
fs = require('fs'), //引入 util 工具包
accessTokenJson = require('./access_token.json'); //引入本地存储的 access_token
var config = require('./config');

exports.textMessageMoYu = function(){
	var weekday=new Array(7);
	weekday[0]="周日";
	weekday[1]="周一";
	weekday[2]="周二";
	weekday[3]="周三";
	weekday[4]="周四";
	weekday[5]="周五";
	weekday[6]="周六";
    var date = new Date();
	var month = date.getMonth() + 1;
	var yyyymmdd = dateFormat("YYYY-mm-dd", date)
	var year = date.getFullYear();
	var day = date.getDate();
	var dayOfTheWeek = date.getDay();
	// 距离周末
	var week = 6 - dayOfTheWeek > 5 ? 0 : 6 - dayOfTheWeek;
	// 距离元旦
	var newYear = solar(year, month, day, 1, 1, yyyymmdd);;

	// 距离春节
	var chineseNewYear = lunar(year, month, day, 1, 1, yyyymmdd);

	// 距离清明节
	var qingming = solar(year, month, day, 4, 4, yyyymmdd);
	
	// 距离劳动节
	var labour = solar(year, month, day, 5, 1, yyyymmdd);
	
	// 端午节
	var duanwu = lunar(year, month, day, 5, 5, yyyymmdd);
	// 端午节的公历日期

	// 中秋节春节
	var zhongqiu = lunar(year, month, day, 8, 15, yyyymmdd);

	// 距离国庆节
	var guoqing = solar(year, month, day, 10, 1, yyyymmdd);


    return `【e影】提醒您:今天是 ${year}年${month}月${day}日, ${weekday[dayOfTheWeek]}，摸鱼人! 工作再累，一定不要忘记摸鱼哦! 有事没事起身去茶水间，去厕所，去廊道走走别老在工位上坐着，钱是老板的,但命是自己的
	距离周末还有:${week}天
	距离元旦节还有:${newYear}天
	距离春节还有:${chineseNewYear}天
	距离清明节还有:${qingming}天
	距离劳动节还有:${labour}天
	距离端午节还有:${duanwu}天
	距离中秋节还有:${zhongqiu}天
	距离国庆节还有:${guoqing}天
	上班是帮老板赚钱，摸鱼是赚老板的钱! 最后，祝愿天下所有摸鱼人，都能愉快的度过每一天…`
}

// 保存用户信息到本地文档
exports.addDataLocal = function(FromUserName) {
	addData(FromUserName);
}

// 发送假日提醒
exports.sendHolidayMsg = function() {
	fs.readFile('./from_user.json', "utf-8", function (err, data) {
		if (err) {
			console.log(err);
		}

		console.log(data);
		console.log(typeof(data))
		for (key in JSON.parse(data)) {
			console.log(key);
		}
		
	})
}

/**
 * 农历天数
 * @param year 
 * @param month 
 * @param festivalDay
 * @param festivalMonth
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
 function lunar(year, month, day, festivalMonth, festivalDay, yyyymmdd){
	
   // 农历天数
	var days;
	// 端午节的公历日期
	var tosolar = Lunar.toSolar(year, festivalMonth, festivalDay);
	if(month > tosolar[1] || (month == tosolar[1] && day > tosolar[2])) {
		tosolar = Lunar.toSolar(year + 1, festivalMonth, festivalDay);
	}
	var rm = tosolar[1];
	var rd = tosolar[2];
	if(rm < 10) {
		rm = "0" + rm;
	}
	if(rd < 10) {
		rd = "0" + rd;
	}
	days = getDaysBetween(yyyymmdd, tosolar[0] +'-'+ rm + '-' + rd);
	return days;
}

function solar(year, month, day, festivalMonth, festivalDay, yyyymmdd) {
	var days;
	var rm = festivalMonth;
	var rd = festivalDay;
	if(rm < 10) {
		rm = "0" + rm;
	}
	if(rd < 10) {
		rd = "0" + rd;
	}
	if(month == festivalDay && day == 1) {
		days = 0;
	} else if (month < festivalDay || (month == festivalMonth && day < festivalDay)){
		days = getDaysBetween(yyyymmdd, year +'-'+ rm + '-' + rd);
	} else {
		days = getDaysBetween(yyyymmdd, (year+1) +'-'+ rm + '-' + rd);
	}

	return days;
}


/**
 * 计算两个日期之间的天数
 * @param startStr  开始日期 yyyy-MM-dd
 * @param endStr  结束日期 yyyy-MM-dd
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
 function  getDaysBetween(startStr, endStr){
	// console.log(startStr);
	// console.log(endStr);
    var  startDate = Date.parse(startStr);
    var  endDate = Date.parse(endStr);
    if (startDate>endDate){
        return 0;
    }

    if (startDate==endDate){
        return 1;
    }

    var days=(endDate - startDate)/(1*24*60*60*1000);
    return  days;
}


function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function getAccessToken(){
	return new Promise(function(resolve,reject){
	  //获取当前时间 
	  var currentTime = new Date().getTime();
	  //格式化请求地址
	  var url = util.format(config.accessTokenApi, config.apiDomain, config.appID, config.appScrect);
	  //判断 本地存储的 access_token 是否有效
	  if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
		requestGet(url).then(function(data){
		  var result = JSON.parse(data); 
		  if(data.indexOf("errcode") < 0){
			accessTokenJson.access_token = result.access_token;
			accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
			//更新本地存储的
			fs.writeFile('./access_token.json',JSON.stringify(accessTokenJson));
			//将获取后的 access_token 返回
			resolve(accessTokenJson.access_token);
		  }else{
			//将错误返回
			resolve(result);
		  } 
		});
	  }else{
		//将本地存储的 access_token 返回
		resolve(accessTokenJson.access_token); 
	  }
	});
  }


//用于处理 https Get请求方法
function requestGet (url){
  return new Promise(function(resolve,reject){
	https.get(url,function(res){
	  var buffer = [],result = "";
	  //监听 data 事件
	  res.on('data',function(data){
		buffer.push(data);
	  });
	  //监听 数据传输完成事件
	  res.on('end',function(){
		result = Buffer.concat(buffer,buffer.length).toString('utf-8');
		//将最后结果返回
		resolve(result);
	  });
	}).on('error',function(err){
	  reject(err);
	});
  });
}


//写入文件，会完全替换之前JSON文件中的内容
function writeData(value) {
	var str = JSON.stringify(value, "", "\t");
 fs.writeFile('./from_user.json', str, function (err) {
	 if (err) {
		 console.error(err);
	 }
	 console.log('写入成功!');
 })
}


// Object.assign(obj1, obj2);//合并两个obj的内容，重复的会被第一个obj替换,最后obj1的内容为obj1+obj2的内容
// Object.keys(person).length;//查看当前obj里同级所有的key的总数，结果为数字
// JSON.stringify(value);//将obj输出成json格式
// JSON.stringify(value, "", "\t");//将obj输出成json格式同时自动格式化
// JSON.parse(value);//将json格式的内容转化为obj
// obj.arrayObj.push(value);//将传来的对象push进数组对象中(前两个写对应的对象)
//读取文件然后在原有文件内容的基础上添加内容，如果key名重复则覆盖
function addData(value) {
 fs.readFile('./from_user.json', "utf-8", function (err, data) {
	 if (err) {
		 console.log(err);
	 }
	 var person = JSON.parse(data);
	 person[value] = value;   
	 var str = JSON.stringify(person, "", "\t");
	 fs.writeFile('./from_user.json', str, function (err) {
		 if (err) {
			 console.error(err);
		 }
		 console.log('新增成功!');
	 })
 })
}