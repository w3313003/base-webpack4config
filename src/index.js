import "./assets/style/index.styl";
import "normalize.css";
import "./assets/style/base.css";


import { getAdvantageInfo, getLinkInfo, getRankInfo, getUpdateLog } from "./base";

$(function () {
    $(".u-center-balance-value").text(data.spot_balance)
    $(".u-center-info span").text(shop_name);
    $("#tip-btn").webuiPopover();

    $(".more-btn").attr("data-type", "代理后台").addClass("hmt-btn");

    getAdvantageInfo();
    getLinkInfo();
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

    getUpdateLog();
});



$("body").on("click", "a.hmt-btn", function () {
    const name = $(this).attr("data-name") || "";
    const type = $(this).attr("data-type");
    const url = $(this).attr("href");
    const params = ["_trackEvent", `阿明插件跳转官网`, `${type}-${name}-${shop_name}`, url, new Date().getTime()];
    window._hmt && window._hmt.push(params)
})