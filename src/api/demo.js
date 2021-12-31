/* eslint-disable */
// 图片地址获取
var imgAddress = 'https://gmiydl.laizhuangb.com/0810gmi/';
var imgLen;
var picArr = [];

var imgArr = [
    { picUrl: 'and-tu-0826.jpg.en' },
    { picUrl: 'and-download.png.en' },
];

var imgArrs = [
    { picUrl: 'ios.jpg' },
    { picUrl: 'ios_download.png' },
    // {picUrl:'ios_installation.png'},
    { picUrl: 'ios_testf.png' },
    { picUrl: 'ios_shop.png' },
    { picUrl: 'ios-bottom-btn.png' },
];

function getImg(box) {
    var len = picArr.length;
    for (var i = 0; i < picArr.length; i++) {
        var url_ = imgAddress + picArr[i].picUrl;

        var this_ = imgLen[i];

        if (url_.substr(-3, 3) === '.en') {
            decryptImage(url_, this_, function (url, this_) {
                this_.setAttribute('src', url);
            });
        } else {
            this_.setAttribute('src', url_);
        }
    }
}

function decryptImage(url_, this_, callback) {
    let xhr = new XMLHttpRequest();
    let url = url_;

    xhr.open('GET', url);
    xhr.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded; charset=UTF-8',
    );
    xhr.responseType = 'arraybuffer';
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let buffer = xhr.response;
            let data = new Uint8Array(buffer);
            let key = [
                118, 111, 100, 95, 112, 114, 111, 106, 101, 99, 116, 95, 101,
                110, 99, 101,
            ];
            let aesEcb = new aesjs.ModeOfOperation.ecb(key);
            data = aesEcb.decrypt(data);
            let blob = new Blob([data], { type: 'application/octet-stream' });
            let url = URL.createObjectURL(blob);
            callback(url, this_);
        }
    };
}

toObtain(); // 区分设备系统

function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf('?') != -1) {
        var str = url.substr(1);
        strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
        }
    }
    return theRequest;
}

var codeVal_, ios_channel, android_channel;
var ios_url, and_url;
var ios_version, android_version, ios_packname;
var isAndroid, isiOS;

bindEvent();

function bindEvent() {
    var Request = new Object();
    Request = GetRequest();
    codeVal_ = Request.code;
    ios_channel = Request.io;
    android_channel = Request.an;
    if (!ios_channel) {
        ios_channel = '1';
    }
    if (!android_channel) {
        android_channel = '2';
    }
    download();
}

function toObtain() {
    var width_ = window.screen.width;
    var u = navigator.userAgent;
    var ua = navigator.userAgent.toLowerCase();
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    if (isAndroid) {
        document
            .querySelector('.android')
            .setAttribute('style', 'display:block;');
        imgLen = document.querySelectorAll('.android img');
        picArr = imgArr;
        getImg(picArr);
    } else if (isiOS) {
        document.querySelector('.ios').setAttribute('style', 'display:block;');
        imgLen = document.querySelectorAll('.ios img');
        picArr = imgArrs;
        getImg(picArr);
        if (width_ >= 1024) {
            // $('.col-lg-4').css({"margin":"0 auto","position": "absolute","left": "50%","transform": "translate(-50%)"});
            document
                .querySelector('.col-lg-4')
                .setAttribute(
                    'style',
                    `"margin":"0 auto","position": "absolute","left": "50%","transform": "translate(-50%)"`,
                );
        }
    } else {
        document
            .querySelector('.android')
            .setAttribute('style', 'display:block;');
        imgLen = document.querySelectorAll('.android img');
        picArr = imgArr;
        getImg(picArr);
        if (width_ >= 1024) {
            // $('.col-lg-4').css({"margin":"0 auto","position": "absolute","left": "50%","transform": "translate(-50%)"});
            document
                .querySelector('.col-lg-4')
                .setAttribute(
                    'style',
                    `"margin":"0 auto","position": "absolute","left": "50%","transform": "translate(-50%)"`,
                );
        }
    }
}
