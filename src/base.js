const baseUrl = "https://test.zhishuchacha.com";

function formatDate(date, fmt) { 
    var o = { 
       "M+" : date.getMonth()+1,                 //月份 
       "d+" : date.getDate(),                    //日 
       "h+" : date.getHours(),                   //小时 
       "m+" : date.getMinutes(),                 //分 
       "s+" : date.getSeconds(),                 //秒 
       "q+" : Math.floor((date.getMonth()+3)/3), //季度 
       "S"  : date.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}        

function parseUrlByReg(url) {
    let ret = {};
    url.replace(/([^?&=]+)=([^&#]+)/g, (_, k, v) => ret[k] = v);
    return ret;
}

const iconMap = {
    1: require("./assets/img/tao-icon.png"),
    2: require("./assets/img/pdd-icon.png"),
    3: require("./assets/img/jd-icon.png")
}

const query = parseUrlByReg(window.location.href);

const cacheMap = window.cache_data ? cache_data.reduce((map, item) => {
    map[item.key] = item;
    return map;
}, {}) : {};

let skuAdvData = [];

export const storage = {
    getItem(key) {
        try {
            const data = localStorage.getItem(key)
            return JSON.parse(data)
        } catch (e) {
            return console.warn(`localStorage中不存在${key}`)
        }
    },
    setItem(key, value) {
        try {
            return localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            return console.warn(
                `设置 ${key} -> ${JSON.stringify(value)} 时发生错误: ${e.message}`
            )
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
}

function isInvalidDate(str) {
    return new Date(str).toString() === "Invalid Date";
}
function getOverTimeColor(dateStr) {
    if (isInvalidDate(dateStr)) {
        return 
    };
    const now = window.cur_time * 1000;
    console.log(now);
    const times = new Date(dateStr.replace(/\-/g, "/")).getTime();
    if (now - times > 0) {
        return "color: #ea291f"
    };
    return ""
}


export function request(option = { }, cacheConfig = null ,onSuccess = new Function(), onError = new Function()) {
    const checkCache = !!cacheConfig;
    if (checkCache) {
        const { key, index } = cacheConfig;
        const cache = storage.getItem(key);
        if (cache && cache.index === index) {
            return onSuccess(cache.data);
        }
    }
    option = {
        ...option,
        method: "POST",
        dataType: "json",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res) {
            if (checkCache) {
                const { key, index } = cacheConfig;
                storage.setItem(key, {
                    index,
                    data: res
                })
            };
            onSuccess(res);
        },
        fail(err) {
            onError(err)
        }
    }
    $.ajax(option);
}

// SKU卖点Cache接口
export function getAdvantageInfo() {
    const cacheConfig = cacheMap['AMING_SKU_USE_TIPS'];
    request(
        {
            url: AMING_SKU_USE_TIPS
        },
        cacheConfig,
        (res) => {
            skuAdvData = res.data;
            renderSku();
        }
    )
}

// 获取链接
export function getLinkInfo(type = "") {
    const cacheConfig = cacheMap['AMING_USER_DETAIL_URLS'];
    request(
        {
            url: AMING_USER_DETAIL_URLS
        },
        cacheConfig,
        (res) => {
            const data = res.data;
            $(".update-log-header-more").attr("href", data.update_log_url);
            if (type === 'ddsz') {
                $("a.feedback").attr("href", "/help/feedback");
            } else {
                $("a.feedback").attr("href", data.advice_url + "?shopName=" + query.shopName);
            }
            $("a.help-video").attr("href", data.help_url);
            $("#qq-link").attr("href", data.qq_kf_url)
            
            $("#qrcode").attr("src", data.wx_kf_url);
            const gwUrl = type === 'ddsz' ? window.ddsz_url : data.gw_url;
            $(".u-center-link a").attr("href", gwUrl).text(gwUrl.replace(/https*\:\/\//, ""));
            $(".u-center-desc a").attr("href", data.flag_soft.url).text(data.flag_soft.title);

            $(".more-btn").attr("href", window.data.agent_url);

            // 轮播
            let otherptHtml = '';
            data.flag_pt.forEach(item => {
                otherptHtml += `
                    <div class="swiper-slide">
                        <a class="slide-item"
                            href="${item.url}" 
                            style="background-image: url(${item.img})" 
                            target="_blank"></a>
                    </div>
                `
            });
            $(".other-product-banner .swiper-wrapper").html(otherptHtml);
            var swiper = new Swiper('.other-product-banner', {
                direction: "horizontal",
                autoplay: 3000,
                loop: true
            });
            $("body").on("click", ".triangle", function () {
                const type = $(this).attr("data-type");
                type === 'next' ? swiper.slideNext() : swiper.slidePrev();
            })
        }
    )
}

// 获取榜单信息
export function getRankInfo(cb) {
    const cacheConfig = cacheMap["AMING_REC_TOPS"];
    request(
        {
            url: AMING_REC_TOPS,
        },
        cacheConfig,
        (res) => {
            const list = res.data;
            let rankHtml = "";
            list.forEach(item => {
                rankHtml += `
                <div class="swiper-slide plugin-right-inner-scroll-item swiper-no-swiping">
                    <span>
                        ${item.name}
                    </span>
                    <span>
                        ${item.balance_total}
                    </span>
                </div>
                `
            });
            $(".plugin-right-inner-scroll .swiper-wrapper").html(rankHtml);

            typeof cb === 'function' && cb();
        }
    )
}

// 获取更新日志
export function getUpdateLog(cb) {
    const cacheConfig = cacheMap['AMING_UPDATE_LOGS']
    request(
        {
            url: AMING_UPDATE_LOGS
        },
        cacheConfig,
        (res) => {
            const PAGE_SIZE = 2;
            const list = res.data
            const ret = [];
            for (let i = 0, len = list.length; i < len; i += PAGE_SIZE) {
              ret.push(list.slice(i, i + PAGE_SIZE));
            }
            const logHtml = ret.reduce((html, item) => {
                const innerHtml = item.reduce((sHtml, sub) => {
                    const contentText = Object.keys(sub.content).reduce((text, k) => {
                        const list = sub.content[k];
                        if (Array.isArray(list) && list.length) {
                            text += list.join("\n")
                        };
                        return text;
                    }, '');
                    sHtml += `
                        <div class="update-log-item">
                            <div class="update-log-item-header">
                                <span>
                                    ${sub.title}
                                </span>
                                <span class="date">
                                    ${sub.date}
                                </span>
                            </div>
                            <div title="${contentText}" class="update-log-item-text">
                                ${contentText}
                            </div>
                        </div>
                    `;
                    return sHtml;
                }, '');
                return html += `
                    <div class="swiper-slide update-log-content">
                        ${innerHtml}
                    </div>
                `;
            }, '');
            $(".update-log-scroller").html(logHtml);
            // typeof cb === 'function' && cb();
        }
    )
}


export function renderSku() {
    let navHtml = '';
    let pt = 0;
    data.sku_data.forEach(item => {
        if (!item.name) return;
        if (item.cur === 1) {
            item.isCur = true;
            pt = item.pt;
        }
        navHtml += `
            <div data-pt="${item.pt}" class="plugin-item ${item.isCur ? 'active' : ''}">
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

const tagMap = {
    1: "cur",
    2: "free"
}
export function onNacChange(pt) {
    pt = pt || 1;
    
    const curItem = data.sku_data.find(item => +item.pt === +pt);
    const list = curItem.list;
    let skuHtml = "";
    function renderTag(sku) {
        if (sku.pre_val && sku.pre_val.indexOf("#")) {
            const strArr = sku.pre_val.split("#");
            const text = strArr[0];
            const index = strArr[1];
            return `<span class="tag ${tagMap[index]}">${text}</span>`;
        }
        return "";
    };
    function getCopyText(target) {
        return target.data.reduce((ret, str) => {
            return ret += `<div style='font-size: 12px;margin-bottom: 8px'>${str}</div>`
        }, '')
    }
    function getUseUrl(target) {
        return target.use_url
    };
    function getHmtParams(name = "", prefix = "") {
        return `${prefix}hmsr=${encodeURIComponent("用户信息")}&hmpl=${encodeURIComponent(name)}&hmcu=&hmkw=&hmci=`;
    };

    list.forEach(sku => {
        const target = skuAdvData.find(item => item.sku_id === sku.sku_id);
        skuHtml += `
            <div class="plugin-row" >
                <div class="plugin-col">
                    ${renderTag(sku)}
                    <span>
                        ${sku.sku_name}
                    </span>
                    ${target ? `
                        <a
                            href="javascript: void(0)"
                            data-trigger="hover"
                            data-placement="top"
                            class="copy-icon"
                        >
                        </a>
                        <div class="webui-popover-content">
                            <div style="font-size: 12px;padding-top: 10px">${getCopyText(target)}</div>
                            ${target.pdt_url ? `<div class='to-gw'>
                                <a data-name="${sku.sku_name}" data-type="官网产品详情" class="to-gw-btn hmt-btn" target="_blank" href="${target.pdt_url  + getHmtParams(sku.sku_name, '?')}">了解更多 </a>
                            </div>` : ''}
                        </div>
                    ` : ""}
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
                    ${sku.is_able_buy === 1 ?
                    ` <a data-name=${sku.sku_name} data-type="${sku.over_time && sku.over_time !== '-' ? '续费' : '购买'}" target="_blank" href="${sku.buy_url + getHmtParams("购买页", "&")}" class="text-btn hmt-btn">
                            ${sku.over_time && sku.over_time !== '-' ? '续费' : '购买'}
                        </a>` : ""
                    }
                    
                    ${sku.send_spot ?
                `<div class="float-tag">
                                赠${sku.send_spot}点
                            </div> ` : ""
            }
                    
                </div>
            </div>
        `
    });
    $(".plugin-list").html(skuHtml);
    
    $(".copy-icon").webuiPopover();
}

// 平台切换
$("body").on("click", ".plugin-item", function () {
    $(this).addClass("active").siblings().removeClass('active');
    onNacChange($(this).attr("data-pt"));
})


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

// 复制
// $("body").on('click', ".copy-icon", function () {
//     const text = $(this).attr("data-text");
//     copy(text)
// })
