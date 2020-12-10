import "./assets/style/index.styl";
import "normalize.css";
import "./assets/style/base.css";
import { getAdvantageInfo, getLinkInfo, getRankInfo, getUpdateLog } from "./base";

window.onload = function () {
    $(".u-center-balance-value").text(data.spot_balance)
    $(".u-center-info span.account").text(shop_name);
    $(".more-btn").attr("data-type", "代理后台").addClass("hmt-btn");

    $(".u-center-info.nickname span").text(`昵称: ${data.user_info.name}`);
    
    $(".u-center-info.wx-icon img").attr("src", data.user_info.wx_headimgurl);
    $(".u-center-info.wx-icon span").text(data.user_info.wx_name);
    getAdvantageInfo();
    getLinkInfo('ddsz');

    getRankInfo(function () {
        new Swiper('.plugin-right-inner-scroll', {
            direction: "vertical",
            mousewheelControl: false,
            loop: true,
            autoplay: 1000,
            // noSwiping: true,
            slidesPerView: 5,
            centeredSlides: true,
            spaceBetween: 0
        })
    });

    getUpdateLog(function () {
        // new Swiper('.update-log-scroller', {
        //     direction: "vertical",
        //     loop: false,
        //     mousewheelControl: true,
        //     scrollbar: '.update-log-scrollbar',
        //     scrollbarHide: false,
        //     scrollbarSnapOnRelease: true,
        //     slidesPerView: 1,
        //     centeredSlides: true,
        //     spaceBetween: 0,
        //     grabCursor: true
        // });
    });
};

$("body").on("click", ".logout", function () {
    try {
        const message = {
            type: 'layout_ddsz'
        };
        window.parent.postMessage(message, '*');
    } catch (e) {
        console.log("postMessage Error", e);
    }
});
$("body").on("click", "a.hmt-btn", function () {
    const name = $(this).attr("data-name") || "";
    const type = $(this).attr("data-type");
    const url = $(this).attr("href");
    const params = ["_trackEvent", `多多插件跳转官网`, `${type}-${name}-${shop_name}`, url, new Date().getTime()];
    window._hmt && window._hmt.push(params)
})