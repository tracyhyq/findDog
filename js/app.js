(function(context){
	var doc = document,
        currentPage,
		entryPage,
		readyPage,
        gamePage,
        sharePage,
        sharePop,
        timeValueEl,
        timeCount = 0,
        dogCount = 1,
        imgCol = 3,
        timer;

	if(doc.addEventListener){
	    doc.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
	}

	function DOMContentLoaded(){
        eventRegister();        
        init();
    }

    function init() {
        currentPage = $('.current-section');
    	entryPage = $('#entry-page');
    	readyPage = $('#ready-page');
        gamePage = $('#game-page');
        sharePage = $('#share-page');
        timeValueEl = $('.time-value');
        sharePop = $('.share-pop');

        randomDogCount();
    }

    function eventRegister(){
    	var startGameEl = $('#start-game'),
    		nextEl = $('#next'),
            imgWrapEl = $('#game-page .imgs-wrap'),
            backEl = $('#game-page #back'),
            shareBtn = $('#share-btn'),
            sharePop = $('.share-pop');

        startGameEl.on('click', function(){
            start();
        });
        nextEl.on('click', function(){
            goNext();
        });
        imgWrapEl.delegate('img', 'click', function(){
            imgClick($(this));
        });
        backEl.on('click', function(){
            goBack($(this));
        });
        shareBtn.on('click', function(){
            share();
        });
        sharePop.on('click', function(){
            sharePop.hide();
        });
    }

    function randomDogCount(){
        dogCount = parseInt(9 * Math.random()) + 1;
        $('#entry-page .num').addClass('num' + dogCount);
    }

    function timePlay() {
        timer = setInterval(function(){
            ++timeCount;
            $.each(timeValueEl, function(index){
                $(this).html(timeCount);
            });
        }, 1000);
    }

    function renderImgs(num){
        var imageWrapEl = $('#game-page .imgs-wrap');

        imageWrapEl.removeClass('imgs3 imgs4 imgs5').addClass('imgs' + num);
        imageWrapEl.html(createHtml(num * num));
    }

    function createHtml(num){
        var html = '',
            arr = [],
            i = 0,
            randomIndex = parseInt(num * Math.random());

        for(; i < num; i++) {
            arr.push('<img src="images/head_man.png" flag="0">');
        }
        if (randomIndex >= num) return 'random error';
        arr[randomIndex] = '<img src="images/head_thief.png" flag="1">';

        return arr.join('');
    }

    function start() {
        currentPage = $('.current-section');
        currentPage.removeClass('current-section');
    	readyPage.addClass('current-section');
        timePlay();
    }

    function goNext() {
        currentPage = $('.current-section');
    	currentPage.removeClass('current-section');
        gamePage.addClass('current-section');
        step1();
    }

    function goBack(tar){
        var prevNode = tar.prev(),
            col = +tar.attr('col');
        switch(col){
            case 5:
                prevNode.attr('col', 4);
                tar.attr('col', 4);
                step2();
                break;
            case 4: 
                prevNode.attr('col', 3);
                tar.attr('col', 3);
                step1();
                break;
            case 3:
                currentPage = $('.current-section');
                currentPage.removeClass('current-section');
                readyPage.addClass('current-section');
                break;
        }
    }

    function imgClick(tar){
        var flag = +tar.attr('flag');

        if(flag){
            goToStep(tar);
        } else {
            showOrHide(1);
            tar.css('border-color', '#ff3c3c');
        }
    }

    function showOrHide(flag){
        var errorTip = $('.error-tip');

        flag ? errorTip.css('visibility', 'visible') : errorTip.css('visibility', 'hidden');
    }

    function goToStep(tar){
        var parentNode = tar.parent(),
            backEl = $('#game-page #back');
            col = +parentNode.attr('col');
        switch(col){
            case 3:
                parentNode.attr('col', 4);
                backEl.attr('col', 4);
                step2();
                break;
            case 4: 
                parentNode.attr('col', 5);
                backEl.attr('col', 5);
                step3();
                break;
            case 5:
                gameOver();
                break;
        }
    }

    function step1(){
        showOrHide(0);
        renderImgs(3);
    }

    function step2() {
        showOrHide(0);
        renderImgs(4);
    }

    function step3() {
        showOrHide(0);
        renderImgs(5);
    }

    function gameOver() {
        currentPage = $('.current-section');
        currentPage.removeClass('current-section');
        initSharePage();
        sharePage.addClass('current-section');
        timer && clearInterval(timer);
    }

    function initSharePage(){
        var cost = sharePage.find('.cost'),
            numEl = sharePage.find('.num');

        cost.html(timeCount);
        numEl.addClass('num' + dogCount);
    }

    /**
     *  分享到朋友圈
     */
    function share() {
        sharePop.show();
    }

/***********************************封装微信内置分享*********************************/

// 开启Api的debug模式
WeixinApi.enableDebugMode();

// 所有功能必须包含在 WeixinApi.ready 中进行
WeixinApi.ready(function(Api){
    // 微信分享的数据
    var wxData = {
        "imgUrl":'http://mmbiz.qpic.cn/mmbiz/iadrjJy3v3icdP2icNHAgbMicicCUuNtca7vwY2iaRlacEzvIbAwGZicJtjkQkJZWBDE8CBDfOYklLt3DHG9gib6gargWg/640',
        "link":'http://finddog.sinaapp.com/',
        "desc":'全民寻找偷狗贼，流浪狗拯救大行动>>',
        "title":'全民寻找偷狗贼，流浪狗拯救大行动>>'
    };
 
    // 分享的回调
    var wxCallbacks = {
        // 分享操作开始之前
        ready : function() {
            // 你可以在这里对分享的数据进行重组
            console.log("准备分享");
        },
        // 分享被用户自动取消
        cancel : function(resp) {
            // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
            console.log("分享被取消，msg=" + resp.err_msg);
        },
        // 分享失败了
        fail : function(resp) {
            // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
            console.log("分享失败，msg=" + resp.err_msg);
        },
        // 分享成功
        confirm : function(resp) {
            // 分享成功了，我们是不是可以做一些分享统计呢？
            console.log("分享成功，msg=" + resp.err_msg);
        },
        // 整个分享过程结束
        all : function(resp,shareTo) {
            // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
            console.log("分享" + (shareTo ? "到" + shareTo : "") + "结束，msg=" + resp.err_msg);
        }
    };

    // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
    Api.shareToFriend(wxData, wxCallbacks);

    // 点击分享到朋友圈，会执行下面这个代码
    Api.shareToTimeline(wxData, wxCallbacks);

    // 点击分享到腾讯微博，会执行下面这个代码
    Api.shareToWeibo(wxData, wxCallbacks);
});

})(window);