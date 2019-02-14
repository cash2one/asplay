var time = 0;
var _CK_ = null;
var bOpen = 0;
var bObj = null;
var msgcache = {}
var player;
function BrowserType() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器 
	// var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
	var isIE = window.ActiveXObject || "ActiveXObject" in window
	// var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器 
	var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
	var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器 
	var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器 
	var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && !isEdge; //判断Chrome浏览器 

	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (userAgent.indexOf('MSIE 6.0') != -1) {
			return "IE6";
		} else if (fIEVersion == 7) { return "IE7"; }
		else if (fIEVersion == 8) { return "IE8"; }
		else if (fIEVersion == 9) { return "IE9"; }
		else if (fIEVersion == 10) { return "IE10"; }
		else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
			return "IE11";
		}
		else { return "0" }//IE版本过低
	}//isIE end 

	if (isFF) { return "FF"; }
	if (isOpera) { return "Opera"; }
	if (isSafari) { return "Safari"; }
	if (isChrome) { return "Chrome"; }
	if (isEdge) { return "Edge"; }
}//myBrowser() end 


function SetCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) return unescape(arr[2]); return null;
}
window.onerror = function () {
	return true;
}
function crossdomainCheck() {
	if (!hosts) return;
	var referagent = document.referrer;
	if (redirecturl.indexOf("http") != 0)
		redirecturl = "http://" + redirecturl
	if (!referagent)
		return top.location.href = redirecturl;

	var hostsarr = hosts.split("|");
	var refer = false;
	var url = referagent;
	var reg = /^http(s)?:\/\/(.*?)\//;

	for (var i = 0; i <= hostsarr.length; i++) {
		if (reg.exec(url) && reg.exec(url)[2].indexOf(hostsarr[i]) >= 0) {
			refer = true;
			break;
		}
	};
	if (!refer) {
		top.location.href = redirecturl;
	};
}

function orderviewinit(timeout) {
	$(function () {
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isIOS = false;
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))
			isIOS = true
		if (isIOS || isAndroid) {
			console.log("prepare111")
			$("#orderview").css("margin-left", "0px");
			$("#orderview").css("margin-top", "0px");
			$("#orderview").css("bototm", "10px");
			$("#orderview").css("left", "-20px");
			$("#orderview").css("display", "block");
			$("#mvideo").css("height", "260px");

			$(".closeview").hide()

		}
		$(".closeview").click(function () {
			$("#orderview").hide();
		});
	})
	timeout = timeout * 1000;
	setTimeout(function () {
		$("#orderview").show();
		if (playertype == 'ckplayer')
			player.videoPause();
		else
			player.pause();
	}, timeout)
}


function init() {
	crossdomainCheck();
	var cookieTime = getCookie(videoid + "_time"); //调用已记录的time
	//alert("上次播放时间"+ cookieTime +"");
	if (!cookieTime || cookieTime == undefined) { //如果没有记录值，则设置时间0开始播放
		cookieTime = 0;
	}
	if (playertype == 'ckplayer_html5')
		ckplay_html5(main, xml, cookieTime);
	else if (playertype == 'ckplayer_flash')
		ckplay_flash(main, xml, cookieTime);
	else if (playertype == 'jsvideo')
		jsvideo(main, xml, cookieTime);
	else
		dplay(main, xml, cookieTime);
}
function timeHandler(t) {
	if (t > -1)
		SetCookie(videoid + "_time", t);
}
function loadHandler() {
	player.addListener('time', timeHandler); //监听播放时间
}

//ckplay_flash
function ckplay_flash(main, xml, starttime) {
	var hostname = window.location.hostname
	var port = window.location.port || '80';
	//var picurl = window.location.protocol + "//" + window.location.host + pic;
	var picurl = pic;
	var url = window.location.protocol + "//" + window.location.host + main
	if (main.indexOf("/") != 0)
		//url = window.location.protocol + "//" + window.location.host + "/" + main
		url = main
	//xml = window.location.protocol + "//" + window.location.host + xml
	xml = xml
	var isiPad = navigator.userAgent.match(/iPhone|Linux|Android|iPad|iPod|ios|iOS|Windows Phone|Phone|WebOS/i) != null;
	if (isiPad) {
		document.getElementById('mvideo').innerHTML = '<video src="' + url + '" controls="controls" autoplay="autoplay" webkit-playsinline="true" style="width: 100%; height: 100%; background-color: rgb(0, 0, 0);" width="100%" height="100%"></video>'
	} else {
		var videoObject = {
			container: '.video',
			variable: 'player',
			loaded: 'loadHandler',
			autoplay: true,
			//poster: picurl,
			video: url
		};
	}

	if (starttime > 0) {
		videoObject['seek'] = starttime;
	}
	player = new ckplayer(videoObject);


}

//jsvideo
function jsvideo(main, xml, starttime) {
	var hostname = window.location.hostname
	var port = window.location.port || '80';
	//var picurl = window.location.protocol + "//" + window.location.host + pic;
	var picurl = pic;
	var url = window.location.protocol + "//" + window.location.host + main
	if (main.indexOf("/") != 0)
		//url = window.location.protocol + "//" + window.location.host + "/" + main
		url = main
	//xml = window.location.protocol + "//" + window.location.host + xml
	xml = xml
	var myPlayer = videojs('my_video', {
      controls : true,
      autoplay : true,
      fluid : false,
      preload : 'auto',
      //poster : 'https://mystatic-1251032780.file.myqcloud.com/ckplayer/tm.jpg',
      language : 'zh-CN',
	  playbackRates: [0.5, 1, 1.5, 2, 4],
		html5: {
		hls: {
	  		//overrideNative : true,
			}
		},
            bigPlayButton : true,
            textTrackDisplay : false,
            posterImage: false,
            errorDisplay : false,
            controlBar : {
                captionsButton : false,
                chaptersButton: false,
                subtitlesButton : false,
				subsCapsButton : false,
				audioTrackButton : false,
                liveDisplay : false,
                playbackRateMenuButton : true,
                remainingTimeDisplay : false,
				descriptionsButton : false,
            },
      /*sources: [{
        src: url,
        type: 'application/x-mpegURL'
      }]*/
    }
    );

	myPlayer.ready(function() { 
		this.hotkeys({
		 volumeStep: 0.1,
		 seekStep: 1,
		 enableModifiersForNumbers: false
		});
	});

	myPlayer.src({
		src: url,
		type: 'application/x-mpegURL',
		//overrideNative : true,
	});

	myPlayer.on('timeupdate', function () {

		var t = Math.floor(myPlayer.currentTime());
		console.log(Math.floor(myPlayer.currentTime()))
		if (t > 0)
			SetCookie(videoid + "_time", t);
	})
	if (starttime > 0)
		myPlayer.currentTime(starttime);
	myPlayer.play();

}