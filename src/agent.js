import "./assets/style/index.styl";
import "normalize.css";
import "./assets/style/base.css";

$(function () {
    $(".u-center-info span").text(shop_name);

    $(".u-center-link a")
        .attr("href", data.mdata.gw_url)
        .text(data.mdata.gw_url.replace(/https*\:\/\//, ""));

    $(".u-center-desc span").text("工具名称:" + data.mdata.proname);

    $(".u-center-contact span").text("微信号:" + data.mdata.wx);

    const iconMap = {
        1: require("./assets/img/tao-icon.png"),
        2: require("./assets/img/pdd-icon.png"),
        3: require("./assets/img/jd-icon.png"),
    };
    const tagMap = {
        1: "cur",
        2: "free"
    };

    function renderTag(sku) {
        if (sku.pre_val && sku.pre_val.indexOf("#")) {
            const strArr = sku.pre_val.split("#");
            const text = strArr[0];
            const index = strArr[1];
            return `<span class="tag ${tagMap[index]}">${text}</span>`;
        }
        return "";
    };

    function getUseUrl(target) {
        return target.use_url
    };

    var skuAdvData = [];
    $.ajax({
        url: SKU_USE_TIPS,
        method: "POST",
        dataType: "json",
        success(res) {
            const data = res.data;
            skuAdvData = data;
            renderSku();
        }
    })

    function renderSku() {
        let navHtml = "";
        let pt = 0;
        data.sku_data.forEach((item) => {
            if (!item.name) return;
            if (item.cur === 1) {
                item.isCur = true;
                pt = item.pt;
            }
            navHtml += `
                <div data-pt="${item.pt}" class="plugin-item ${item.isCur ? "active" : ""
                }">
                    <img src="${iconMap[item.pt]}" />
                    <span>
                        ${item.name}
                    </span>
                </div>
            `;
        });
        onNacChange(pt);
        $(".plugin-nav").html(navHtml);
    }
    
    function isInvalidDate(str) {
        return new Date(str).toString() === "Invalid Date";
    }
    function getOverTimeColor(dateStr) {
        if (isInvalidDate(dateStr)) {
            return 
        };
        const now = window.cur_time * 1000;
        const times = new Date(dateStr.replace(/\-/g, "/")).getTime();
        if (now - times > 0) {
            return "color: #ea291f"
        };
        return ""
    }
    
    function onNacChange(pt) {
        pt = pt || 1;

        const curItem = data.sku_data.find((item) => +item.pt === +pt);
        const list = curItem.list;
        let skuHtml = "";
        
    
        list.forEach((sku) => {
            const target = skuAdvData.find(item => item.sku_id === sku.sku_id);
            skuHtml += `
            <div class="plugin-row" >
                <div class="plugin-col">
                    ${renderTag(sku)}
                    <span>
                        ${sku.sku_name}
                    </span>
                </div>
                <div class="plugin-col" style="${getOverTimeColor(sku.over_time)}">
                    ${sku.over_time}
                </div>
                <div class="plugin-col">
                    ${target ?
                        `<a target="_blank" class="to-plugin-href text-btn" href="${getUseUrl(target)}">
                            去使用
                        </a>` : ""
                    }
                    ${ sku.is_able_buy === 1 ?
                    ` <a data-name=${sku.sku_name} data-type="${sku.over_time && sku.over_time !== "-" ? "续费" : "购买"}" target="_blank" href="${sku.buy_url}" class="text-btn hmt-btn">
                            ${sku.over_time && sku.over_time !== "-"? "续费" : "购买"}
                        </a>` :
                    "" }
                    
                    ${sku.send_spot ? 
                        `<div class="float-tag">
                            赠${sku.send_spot}点
                        </div> `
                    : ""}
                    
                </div>
            </div>
        `;
        });
        $(".plugin-list").html(skuHtml);
    }

    // 平台切换
    $("body").on("click", ".plugin-item", function () {
        $(this).addClass("active").siblings().removeClass("active");
        onNacChange($(this).attr("data-pt"));
    });

    $(".t-header .plugin-col:last-child").css("padding-left", 0)
    
    // 清除缓存
    $("body").on("click", "#clear-storage", function () {
        try {
            const message = {
                type: 'storageClear'
            };
            window.parent.postMessage(message, '*');
        } catch (e) {
            console.log("postMessage Error", e);
        }
    })
});
