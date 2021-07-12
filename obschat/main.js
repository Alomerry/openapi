const DEBUG_MODE = true;

const twitchOpenApiPrefix = "/api"
const openApiPrefix = "/api/v1"
let scroll_to_bottom_btn; //捲到到最新行的按鈕 #scroll_to_bottom_btn
let tool_bar_datetime_span; //toolbar時間

// 检查浏览器来源
// 返回 string
// 值: "obs_browser", "desktop_app", "normal_browser"
// 參考資料: https://github.com/obsproject/obs-browser/blob/master/README.md
const check_browser_source = function () {
  if (typeof window.obsstudio !== 'undefined') { // obs studio 专用 js
    document.body.id = "css_for_obs";
    return "obs_browser";
  } else {
    if (window.navigator.userAgent.match(/twitchchat/i) !== null) {
      document.body.id = "css_for_desktop"
      return "desktop_app";
    } else {
      // document.body.id = "css_for_browser" // 默认值
      return "normal_browser";
    }
  }
};
let browser_source = check_browser_source();

const page_load_time = new Date().getTime();
let chat_ws_conn_time = new Date().getTime();

const client_id = 'chikattochikachika';
const twitchClientId = "ixqqe9qqmuwq0rw7n6jn3oibqby7pj"

// 房间人物信息列表
var userInfoMap
// streamer 弹幕姬设置
let streamerDanmakuSetting


let output; //聊天室輸出 div#output
let output_last_lines = new Array(); //保存最新的n行訊息
let heat; //熱度 div#heat -D
let user_cnt; //觀眾數 div#user_cnt
let viewers = 0;
let setting_div; //設定欄 #setting_div
let ping; // 保持websocket連線,PING-PONG
let ping2; // 保持websocket連線,PING-PONG
let ping_ovs;
let tokens = []; //連線資訊
let last_msg_time = 0;

//檢查使用者自訂的css display屬性
// none為false,否則為true
var cssCheck_kk_gift;
var cssCheck_kk_reconn;
var cssCheck_kk_bana;
var cssCheck_kk_come;

var reconnection_chat_count = 0; //計算斷線重連次數 chat server
var reconnection_overseas_chat_count = 0;
var reconnection_gift_count = 0; //計算斷線重連次數 gift server

//外部變數(index.htm<script>)
//無設定時使用預設值
var obs_mode;
var chat_limit;
var csrf_token;

if (typeof document.body.dataset.obs_mode === "undefined") {
  obs_mode = false;
} else {
  obs_mode = (document.body.dataset.obs_mode == "true" || document.body.id === "css_for_obs");
}

if (typeof document.body.dataset.chat_limit === "undefined") {
  chat_limit = 10;
} else {
  chat_limit = parseInt(document.body.dataset.chat_limit);
}

if (typeof document.body.dataset.csrf_token === "undefined") {
  csrf_token = false;
} else {
  csrf_token = document.body.dataset.csrf_token;
}

/*
CSS:
.toggle-content { display: none; }
.toggle-content.is-visible { display: block; }

JS:
elemVisibility.init(elem);
elemVisibility.show(elem);
elemVisibility.hide(elem);
elemVisibility.toggle(elem);
elemVisibility.check(elem);
*/
const elemVisibility = {
  init: function (elem, default_show = true) {
    elem.classList.add('toggle-content'); // display: none;
    if (default_show) {
      this.show(elem); // display: block;
    }
  },
  init_inline(elem, default_show = true) {
    elem.classList.add('toggle-content'); // display: none;
    if (default_show) {
      this.show_inline(elem); // display: inline-block;
    }
  },
  show: function (elem) {
    elem.classList.add('is-visible'); // display: block;
  },
  show_inline: function (elem) {
    elem.classList.add('is-visible-inline'); // display: inline-block;
  },
  hide: function (elem) {
    elem.classList.remove('is-visible');
  },
  toggle: function (elem) {
    elem.classList.toggle('is-visible');
  },
  toggle_inline: function (elem) {
    elem.classList.toggle('is-visible-inline');
  },
  check: function (elem) {
    if (getComputedStyle(elem).display === 'none') {
      return false;
    } else {
      return true;
    }
  }
};

const OpenApi = {
  post: function (ajax_post_type = 'test', ajax_post_obj = {}) {
    let post_data = {
      csrf_token: document.body.dataset.csrf_token,
      type: ajax_post_type,
      data_obj: ajax_post_obj
    };

    return fetch(
      '/api.php',
      {
        method: 'POST', // GET, POST
        headers: {
          'content-type': 'application/json',
          'Client-ID': client_id
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'same-origin', // no-cors, cors, *same-origin
        body: JSON.stringify(post_data)
      }
    ).then((response) => {
      return response.json();
    });
  },

  // Get 请求 Twitch V5 Api
  getByTwitchApi: function (url = 'url') {
    return fetch(
      twitchOpenApiPrefix + url,
      {
        method: 'GET', // GET, POST
        headers: {
          "Accept": "application/vnd.twitchtv.v5+json",
          "Client-ID": twitchClientId // "wbmytr93xzw8zbg0p1izqyzzc5mbiz"
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      }
    ).then((response) => {
      return response.json();
    });
  },
  // Post 请求 Twitch V5 Api
  postByTwitchApi: function (url = 'url', data = {}) {
    return fetch(
      twitchOpenApiPrefix + url,
      {
        method: 'POST',
        headers: {
          "Accept": "application/vnd.twitchtv.v5+json",
          "Client-ID": twitchClientId // "wbmytr93xzw8zbg0p1izqyzzc5mbiz"
          // todo header
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        body: JSON.stringify(data)
      }
    ).then((response) => {
      return response.json();
    });
  },

  getByOpenApi: function (config = {}) {
    return fetch(
      openApiPrefix + config.url,
    ).then((response) => {
      return response.json();
    })
  },

  // todo next
  checkTwitchApiLastTime: function (userid) {
    //避免OBS重複使用多個網頁圖層時重複請求API(實況主可能會在不疼OBS場景放同一個聊天室網頁)
    //1分鐘內有請求過的話直接向localStorage讀取
    if (obs_mode === true) {
      if (localStorage.getItem('twitchApi_lastTime') !== null && (userid == localStorage.getItem('twitchApi_stream_userid'))) {
        if (localStorage.getItem('twitchApi_lastTime') * 1.0 <= ((new Date().getTime() * 1.0) - (60000))) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
    //return true;
  },
  getTwitchViewers: function (_user_id) {
    // todo get twitch viewers
  },

  // 根据 url 的弹幕码获取 streamerId
  getStreamerIdByDanmakuUrl: function (danmakuUrl) {
    return this.getByOpenApi({url: "/danmaku/validate?danmakuUrl=" + danmakuUrl}).then(res => {
      return res
    });
  },
  // 根据 streamerId 获取 streamer 的登录名
  getStreamerNameByStreamerId: function (streamerId) {
    return this.getByOpenApi({url: "/users/" + streamerId}).then(res => {
      return res
    });
  },

  // 根据 streamerId 获取 streamer 的设置
  getStreamerSettingByStreamerId: function (streamerId) {
    return this.getByOpenApi({url: "/settings/" + streamerId}).then(res => {
      return res
    });
  },

  getTwitchStreamInfo: function () {
    // todo
    // geturl username
    // get channel
    // get stream
  },

  // 根据登录名获取 Twitch 用户
  getTwitchUserByLoginName: function (username) {
    return this.getByTwitchApi('/users?login=' + username);
  }
};

//統計 todo next
/*
  目前熱度 ofc_heat
  目前觀眾數 ofc_online_user

  最高熱度 max_heat
  最高觀眾數 max_online_user

  累計留言數 msg_count
  累計留言人數 msg_user_count

  累計進入聊天室人數 join_count
  累計追隨人數 follow_count
*/
/*
const stats = {
    init: function () {
        //
        this.ofc_heat = 0;
        this.ofc_online_user = 0;
        this.max_heat = 0;
        this.max_online_user = 0;
        this.msg_count = 0;
        this.msg_user_count = 0;
        this.join_count = 0;
        this.follow_count = 0;

        //Set
        this.msg_user_count_set = new Set();
        this.join_count_set = new Set();
        this.follow_count_set = new Set();

        //elemVisibility.init(document.getElementById('stats_ui'));
    },
    set_max_heat: function (new_heat) {
        if (new_heat > this.max_heat) this.max_heat = new_heat;
    },
    set_max_online_user: function (new_online_user) {
        if (new_online_user > this.max_online_user) this.max_online_user = new_online_user;
    },
    msg_user_count_set_add: function (user_id) {
        this.msg_user_count_set.add(user_id);
        this.msg_user_count = this.msg_user_count_set.size;
    },
    join_count_set_add: function (user_id) {
        this.join_count_set.add(user_id);
        this.join_count = this.join_count_set.size;
    },
    follow_count_set_add: function (user_id) {
        this.follow_count_set.add(user_id);
        this.follow_count = this.follow_count_set.size;
    },
    refresh_ui: function () {
        //
        this.set_max_heat(this.ofc_heat);
        this.set_max_online_user(this.ofc_online_user);

        if (obs_mode == false) {
            let elem_stats_ui = document.getElementById('stats_ui');
            let elem_stats_ui_show = !(getComputedStyle(elem_stats_ui).display === 'none');

            if (document.getElementById("statsUiCheck").checked == false) {
                if (elem_stats_ui_show) elemVisibility.hide(elem_stats_ui);
            } else {
                if (!elem_stats_ui_show) elemVisibility.show(elem_stats_ui);

                elem_stats_ui.innerHTML = `
                    聊天統計<br>
                    (僅供參考,不保證資料正確)<br>
                    <br>
                    目前熱度: ${main.numberWithCommas(this.ofc_heat)}<br>
                    目前觀眾數: ${main.numberWithCommas(this.ofc_online_user)}<br>
                    <br>
                    最高熱度: ${main.numberWithCommas(this.max_heat)}<br>
                    最高觀眾數: ${main.numberWithCommas(this.max_online_user)}<br>
                    <br>
                    累計留言數: ${main.numberWithCommas(this.msg_count)}<br>
                    累計留言人數: ${main.numberWithCommas(this.msg_user_count)}<br>
                    <br>
                    累計新進入人數: ${main.numberWithCommas(this.join_count)}<br>
                    累計新追隨人數: ${main.numberWithCommas(this.follow_count)}<br>
                    <br>
                    [${main.get_time_full()}]<br>
                `;
            }
        }
    }
};*/

//日期時間字串
class dateTimeString {
  constructor() {
  }

  static _pt(num) { //數字小於10時前面補0 (顯示時間用,例 12:07)
    return (num < 10 ? "0" : "") + num;
  }

  static get_time() { //取得目前時間
    let now_time = new Date();

    //let year = now_time.getFullYear();
    //let month = this.pt( now_time.getMonth() + 1 );
    //let day = this.pt( now_time.getDate() );
    let hours = this._pt(now_time.getHours());
    let minutes = this._pt(now_time.getMinutes());
    //let seconds = this.pt( now_time.getSeconds() );

    let txt_datetime = `${hours}:${minutes}`;

    return txt_datetime;
  }

  static get_time_full_2() { //取得目前時間
    let now_time = new Date();

    let year = now_time.getFullYear();
    let month = this._pt(now_time.getMonth() + 1);
    let day = this._pt(now_time.getDate());
    let hours = this._pt(now_time.getHours());
    let minutes = this._pt(now_time.getMinutes());
    let seconds = this._pt(now_time.getSeconds());

    let txt_datetime = `${month}/${day} ${hours}:${minutes}`;

    return txt_datetime;
  }
}

//提高安全性,目標是移除所有innerHTML
//文字內容由textContent取代
const _createElement = {
  img_string: function (url = '', alt = '', class_name_arr = []) {
    let img = document.createElement("img");
    img.src = url;
    img.alt = alt;
    img.title = alt;
    //img.classList = "";
    img.classList.add(...class_name_arr);
    return img.outerHTML; // outerHTML本身會轉成string輸出
  },
  span_chat_msg: function (name = '', name_color = '', message_with_emotes = '') {
    let msg_line_span = document.createElement("span");
    let name_span = document.createElement("span");
    name_span.textContent = name;
    name_span.style.color = name_color;
    let msg_span = document.createElement("span");
    msg_span.innerHTML = ` : ${message_with_emotes}`; //包含<img>

    msg_line_span.appendChild(name_span);
    msg_line_span.appendChild(msg_span);

    return msg_line_span.outerHTML;
  }
};

class twitchChatFormat {
  constructor() {
  }

  static twitch_format_emotes(text, emotes) {
    let splitText = text.split('');
    for (let i in emotes) {
      let e = emotes[i];
      for (let j in e) {
        let mote = e[j];
        if (typeof mote == 'string') {
          mote = mote.split('-');
          mote = [parseInt(mote[0]), parseInt(mote[1])];
          let length = mote[1] - mote[0],
            empty = Array.apply(null, new Array(length + 1)).map(function () {
              return ''
            });
          splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));

          let _img_src = `https://static-cdn.jtvnw.net/emoticons/v1/${i}/1.0`;
          let _img_alt = 'emote';
          let _img_class_list = ["emoticon"];

          let _img_ele_str = _createElement.img_string(_img_src, _img_alt, _img_class_list);

          splitText.splice(mote[0], 1, _img_ele_str);
        }
      }
    }
    return this.htmlEntities(splitText).join('');
  }

  static htmlEntities(html) {
    // function it() {
    //     return html.map(function(n, i, arr) {
    //             if(n.length == 1) {
    //                 return n.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    //                        return '&#'+i.charCodeAt(0)+';';
    //                     });
    //             }
    //             return n;
    //         });
    // }
    let isArray = Array.isArray(html);
    if (!isArray) {
      html = html.split('');
    }
    html = this.it(html);
    if (!isArray) html = html.join('');
    return html;
  }

  static it(html) {
    return html.map(function (n, i, arr) {
      if (n.length == 1) {
        return n.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
          return '&#' + i.charCodeAt(0) + ';';
        });
      }
      return n;
    });
  }
}

const browserController = {
  reload: function (_bool = false) {
    location.reload(_bool); //重新載入頁面
    // false - Default. Reloads the current page from the cache.
    // true - Reloads the current page from the server
  }
};

class chatView {
  constructor(chat_container, chat_lines_limit, parent_container, chat_scroll_to_bottom_btn) {
    this.chat_container = document.querySelector(chat_container);
    this.chat_lines_limit = chat_lines_limit;
    this.parent_container = document.querySelector(parent_container);
    this.chat_scroll_to_bottom_btn = document.querySelector(chat_scroll_to_bottom_btn);

    this.stop_scroll = false; //上拉時防止捲動
  }

  clear() {
    this.chat_container.innerHTML = '';
  }

  dom() {
    return this.chat_container;
  }

  addChatline(message, class_name_arr) {
    let pre = document.createElement("div");
    //pre.style.wordWrap = "break-word";
    pre.classList.add("output_lines");
    if (typeof class_name_arr !== "undefined") {
      pre.classList.add(...class_name_arr);
    } else {
      pre.classList.add("kk_chat");
    }

    message = message.trim();
    //pre.innerHTML = message.replace(/\n/g, "<br />"); // 將"\n"轉換成"<br />"
    //pre.innerHTML = `<span class="kk_time">${this.get_time()}</span><span class="kk_border"></span>${message}`;
    pre.innerHTML = `<span class="kk_time kk_pod">${dateTimeString.get_time()}</span>${message}`;

    this.chat_container.appendChild(pre); //輸出訊息在畫面上

    this.autoScrollToBottom(); //自動捲動

    this.checkChatLinesLimit(); //維持聊天室的最高行數,多則刪除

    this.autoScrollToBottom(); //自動捲動(避免刪行完版面跑掉,刪完後再自動捲動一次)
  }

  checkChatLinesLimit() {
    //新方法
    //選while而不用加一刪一是因為要防bug漏算導致越積越多行
    //*目前不確定writeToScreen()如果送出太快太密集會不會導致行數多刪
    while (this.chat_container.childElementCount > this.chat_lines_limit) {
      this.chat_container.removeChild(this.chat_container.childNodes[0]);
    }
  }

  autoScrollToBottom() {
    //畫面自動捲動
    if (this.stop_scroll == false) {
      window.scrollTo(0, this.parent_container.scrollHeight); //畫面自動捲動
      if (obs_mode == false) {
        elemVisibility.hide(scroll_to_bottom_btn);
      }
    } else {
      //document.getElementById("scroll_to_bottom_btn").style.display = 'block';
    }
  }

  scroll_to_bottom_btn() { //向下捲動的按鈕
    //let scroll_to_bottom_btn = document.getElementById("scroll_to_bottom_btn");
    this.chat_scroll_to_bottom_btn.addEventListener("mouseup", () => {
      window.scrollTo(0, this.parent_container.scrollHeight);
      //document.getElementById("scroll_to_bottom_btn").style.display = 'none';
      elemVisibility.hide(this.chat_scroll_to_bottom_btn);
      this.stop_scroll = false;
    });
  }

  checkScroll() { //檢查畫面捲動方向,如果向上則觸法暫停捲動功能
    //原版
    if (obs_mode != true) {
      /*
      let lastScrollTop = 0;
      window.addEventListener("scroll", function () {
        //console.log("on scroll");
        if(document.visibilityState === 'visible'){
          let st = window.pageYOffset || document.documentElement.scrollTop;
          //console.log(st, lastScrollTop);
          if ((st+130) > lastScrollTop) {
            // downscroll code
            //console.log("down scroll");
          } else {
            // upscroll code
            //console.log("up scroll");
            this.stop_scroll = true;
            //document.getElementById("scroll_to_bottom_btn").style.display = 'block';
            elemVisibility.show(scroll_to_bottom_btn);
          }
          lastScrollTop = st;
        }
      }, false);
      */

      this.parent_container.addEventListener('wheel', () => {
        this.stop_scroll = true;
        elemVisibility.show(this.chat_scroll_to_bottom_btn);
      });

      this.parent_container.addEventListener("touchmove", () => {
        this.stop_scroll = true;
        elemVisibility.show(this.chat_scroll_to_bottom_btn);
      });
    }
  }
}

const chat_container = new chatView("#output", chat_limit, "body", "#scroll_to_bottom_btn");

const main = {
  init: function () {
    // 当 hashtag 改变时重新载入页面
    window.addEventListener("hashchange", function () {
      browserController.reload();
    }, false);

    // 判断载入分页
    if (window.location.hash == '' || window.location.hash == '#') {
      // 载入首页
      this.goto_home_page();
    } else {
      // 载入聊天室页面
      this.goto_chat_page();
    }
  },
  check_hashtag_value: function () {
    if (window.location.hash == '' || window.location.hash == '#') {
      //
    } else {
      let raw_hashtag_value = window.location.hash.substr(1);

      if (raw_hashtag_value.startsWith("twitch:") === true) {
        //twitch
        let raw_twitch_channel_name = raw_hashtag_value.replace(/^twitch:/ig, '');

        OpenApi.getStreamerIdByDanmakuUrl(raw_twitch_channel_name).then(res => {
          this.log("streamerId:", res.data.id)
          OpenApi.getStreamerNameByStreamerId(res.data.id).then(res => {
            this.log("twitchName:", res.data.twitchName)
            this.load_twitch_chat(res.data.twitchName);
          })

          OpenApi.getStreamerSettingByStreamerId(res.data.id).then(res => {
            this.log("弹幕姬设置:", res.data.danmakuSetting)
            streamerDanmakuSetting = res.data.danmakuSetting
          })
        })
      } else {
        // others
      }
    }
  },
  goto_home_page: function () { //載入首頁
    let c_script = document.getElementById("c_script");
    elemVisibility.show(c_script);
    this.change_channel_btn(); //改完後觸發hashchange重載頁面
  },
  goto_chat_page: function () { //載入聊天室頁面
    chat_container.checkScroll(); //檢查畫面捲動方向,如果向上則觸法暫停捲動功能

    output = document.getElementById("output"); //聊天室輸出
    output.textContent = '';

    heat = document.getElementById("heat"); //熱度
    heat.textContent = '● 載入中..';

    user_cnt = document.getElementById("user_cnt"); //觀眾數
    user_cnt.textContent = '';

    if (obs_mode == false) {
      //關閉checkbox
      document.querySelector("#ttsCheck").checked = false; //語音
      document.querySelector("#statsUiCheck").checked = false; //統計

      chat_container.scroll_to_bottom_btn(); //建立向下捲動按鈕

      //開啟設定選單
      setting_div = document.getElementById("setting_div");
      scroll_to_bottom_btn = document.getElementById("scroll_to_bottom_btn");

      document.getElementById("tool_bar").addEventListener("mouseup", function () {
        elemVisibility.toggle(setting_div);
      });
    }

    this.check_hashtag_value();
  },
  get_twitch_viewers: function (twitch_channel_name) {
    /*BanaApi.getTwitchViewers(twitch_channel_name).then((data) => {
        console.log(data);

        if ((typeof data !== "undefined")) {
            if (data !== false) {
                if (obs_mode === true) {
                    // Clear all items (避免bug)
                    //localStorage.clear();

                    // remove item (避免bug)
                    localStorage.removeItem('twitchApi_stream_userid');
                    localStorage.removeItem('twitchApi_stream_obj');
                    localStorage.removeItem('twitchApi_lastTime');

                    localStorage.setItem('twitchApi_stream_userid', twitch_channel_name);
                    localStorage.setItem('twitchApi_stream_obj', JSON.stringify(data));
                    localStorage.setItem('twitchApi_lastTime', new Date().getTime());
                }

                if (data.stream !== null) {
                    console.log(`[Twitch API] stream online`);
                    //user_cnt.textContent = `● ${this.numberWithCommas(data.stream.viewers)}`;
                    user_cnt.innerHTML = `<i class="bi bi-heart-fill"></i> ${this.numberWithCommas(data.stream.channel.followers)} <i class="bi bi-person-fill"></i> ${this.numberWithCommas(data.stream.viewers)}`;
                } else {
                    console.log(`[Twitch API] stream offline`);
                    user_cnt.textContent = `● offline`;
                }
            }
        }
    });*/
  },
  load_twitch_chat: function (twitch_channel_name) {
    //
    //heat.textContent = `● TWITCH/${twitch_channel_name.toUpperCase()}`;
    heat.textContent = '';

    user_cnt.textContent = `● offline`;

    //時間
    //if (obs_mode === false) {
    tool_bar_datetime_span = document.getElementById("tool_bar_datetime");
    this.display_datetime();
    //}

    let known_twitch_id_array = ["huaishu", "likujiang", "fudao1199", "lmsj193", "chunfafa", "eotones"];

    //取得最新觀眾數
    let get_viewers_interval = 300000;
    if (known_twitch_id_array.includes(twitch_channel_name)) get_viewers_interval = 60000; //已知twitch id
    this.get_twitch_viewers(twitch_channel_name);
    setInterval(() => {
      this.get_twitch_viewers(twitch_channel_name);
    }, get_viewers_interval);

    elemVisibility.hide(document.getElementById("announcements"));

    if (obs_mode == true) {
      elemVisibility.show(document.getElementById("tool_bar"));
    } else {
      elemVisibility.hide(document.getElementById("joinCheck_lab"));
      elemVisibility.hide(document.getElementById("giftCheck_lab"));
      elemVisibility.show(document.getElementById("tool_bar"));
    }

    chat_container.addChatline(`<span class="pod">INFO</span><i class="bi bi-twitch"></i> ${twitch_channel_name}`);
    this.log('[twitch]');

    // tmi.js文件:
    // https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md
    const client = new tmi.Client({
      options: {debug: false, messagesLogLevel: "info"},
      connection: {
        reconnect: true,
        secure: true
      },
      identity: {
        username: 'justinfan12345',
        password: 'oauth:kappa',
        // username: 'alomerry',
        // password: 'oauth:vt5e1ifhtuy8po0twhhf4apbfsk7cu'
      },
      channels: [twitch_channel_name]
    });
    client.connect().catch(console.error);

    client.on('chat', (channel, userstate, message, self) => {
      if (self) return;
      // if(message.toLowerCase() === '!hello') {
      //     client.say(channel, `@${tags.username}, heya!`);
      // }
      //console.log(tags);

      //名字顏色
      if (userstate.color == null) {
        userstate.color = '#1dddf8';
      } else if (userstate.color === '#000000') {
        //因為CSS文字陰影為全黑,如果字也全黑會讓字體難以辨識,所以改成灰色
        userstate.color = '#333333';
      }

      let message_with_emotes = twitchChatFormat.twitch_format_emotes(message, userstate.emotes);

      if (userInfoMap == null) {
        userInfoMap = new Map()
      }

      let userInfo = userInfoMap.get(userstate['username'])

      let full_msg = '';

      //console.log(userstate);

      let is_mod = false;

      // 设置头像
      if (userInfo == null) {
        OpenApi.getTwitchUserByLoginName(userstate['username']).then((body) => {
          userInfoMap.set(userstate['username'], body.users[0])
          let url = `${body.users[0].logo}`
          this.log(url)
          if (userstate['display-name'].toLowerCase() === userstate.username.toLowerCase()) {
            full_msg += _createElement.img_string(`${body.users[0].logo}`, "head", ['circleImg']) + " "
          } else {
            full_msg += _createElement.img_string(`${body.users[0].logo}`, "head", ['circleImg']) + " "
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        this.log(`${userInfo.logo}`)
        if (userstate['display-name'].toLowerCase() === userstate.username.toLowerCase()) {
          full_msg += _createElement.img_string(`${userInfo.logo}`, "head", ['circleImg']) + " "
        } else {
          full_msg += _createElement.img_string(`${userInfo.logo}`, "head", ['circleImg']) + " "
        }
      }

      if (userstate.badges != null) {
        //admin
        if (('admin' in userstate.badges) && userstate.badges.admin >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/1", "admin", ['twitch_badges']) + " ";
        }

        //staff
        if (('staff' in userstate.badges) && userstate.badges.staff >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/1", "staff", ['twitch_badges']) + " ";
        }

        //global_mod
        if (('global_mod' in userstate.badges) && userstate.badges.global_mod >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/9384c43e-4ce7-4e94-b2a1-b93656896eba/1", "global_mod", ['twitch_badges']) + " ";
        }

        //ambassador
        if (('ambassador' in userstate.badges) && userstate.badges.ambassador >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/2cbc339f-34f4-488a-ae51-efdf74f4e323/1", "ambassador", ['twitch_badges']) + " ";
        }

        //是否為台主
        if (('broadcaster' in userstate.badges) && userstate.badges.broadcaster >= 1) {
          //full_msg += `<img src="https://static-cdn.jtvnw.net/chat-badges/broadcaster.png" alt="broadcaster" title="broadcaster"> `;
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/chat-badges/broadcaster.png", "broadcaster", ['twitch_badges']) + " ";
          is_mod = true;
        }

        //是否為mod
        if (('moderator' in userstate.badges) && userstate.badges.moderator >= 1) {
          //full_msg += `<img src="https://static-cdn.jtvnw.net/chat-badges/mod.png" alt="moderator" title="moderator"> `;
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/chat-badges/mod.png", "moderator", ['twitch_badges']) + " ";
          is_mod = true;
        }

        //是否為vip
        if (('vip' in userstate.badges) && userstate.badges.vip >= 1) {
          //full_msg += `<img src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1" alt="vip" title="vip"> `;
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1", "vip", ['twitch_badges']) + " ";
        }

        //是否為訂閱者
        if (('subscriber' in userstate.badges) && userstate.badges.subscriber >= 0) {
          //full_msg += `<img src="https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1" alt="subscriber" title="subscriber"> `;
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1", "subscriber", ['twitch_badges']) + " ";
        }

        //sub-gift-leader
        if (('sub-gift-leader' in userstate.badges) && userstate.badges['sub-gift-leader'] >= 1) {
          let sub_gift_leader_url = '';
          if (userstate.badges['sub-gift-leader'] == 1) sub_gift_leader_url = "https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/1";
          if (userstate.badges['sub-gift-leader'] == 2) sub_gift_leader_url = "https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/1";
          if (userstate.badges['sub-gift-leader'] == 3) sub_gift_leader_url = "https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/1";

          if (sub_gift_leader_url.length > 0) full_msg += _createElement.img_string(sub_gift_leader_url, "sub-gift-leader", ['twitch_badges']) + " ";
        }

        //sub-gifter
        if (('sub-gifter' in userstate.badges) && userstate.badges['sub-gifter'] >= 1) {
          let sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/f1d8486f-eb2e-4553-b44f-4d614617afc1/1';
          if (userstate.badges['sub-gifter'] >= 1) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/f1d8486f-eb2e-4553-b44f-4d614617afc1/1';
          if (userstate.badges['sub-gifter'] >= 5) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/3e638e02-b765-4070-81bd-a73d1ae34965/1';
          if (userstate.badges['sub-gifter'] >= 10) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/bffca343-9d7d-49b4-a1ca-90af2c6a1639/1';
          if (userstate.badges['sub-gifter'] >= 25) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/17e09e26-2528-4a04-9c7f-8518348324d1/1';
          if (userstate.badges['sub-gifter'] >= 50) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/47308ed4-c979-4f3f-ad20-35a8ab76d85d/1';
          if (userstate.badges['sub-gifter'] >= 100) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/5056c366-7299-4b3c-a15a-a18573650bfb/1';
          if (userstate.badges['sub-gifter'] >= 250) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/df25dded-df81-408e-a2d3-40d48f0d529f/1';
          if (userstate.badges['sub-gifter'] >= 500) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/f440decb-7468-4bf9-8666-98ba74f6eab5/1';
          if (userstate.badges['sub-gifter'] >= 1000) sub_gifter_url = 'https://static-cdn.jtvnw.net/badges/v1/b8c76744-c7e9-44be-90d0-08840a8f6e39/1';

          full_msg += _createElement.img_string(sub_gifter_url, "sub-gifter", ['twitch_badges']) + " ";
        }

        //bits-leader
        if (('bits-leader' in userstate.badges) && userstate.badges['bits-leader'] >= 1) {
          let bits_leader_url = '';
          if (userstate.badges['bits-leader'] == 1) bits_leader_url = "https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/1";
          if (userstate.badges['bits-leader'] == 2) bits_leader_url = "https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/1";
          if (userstate.badges['bits-leader'] == 3) bits_leader_url = "https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/1";

          if (bits_leader_url.length > 0) full_msg += _createElement.img_string(bits_leader_url, "bits-leader", ['twitch_badges']) + " ";
        }

        //bits
        if (('bits' in userstate.badges) && userstate.badges.bits >= 1) {
          let bits_badge_url = 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1';

          if (userstate.badges.bits >= 1) bits_badge_url = 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1';
          if (userstate.badges.bits >= 100) bits_badge_url = 'https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/1';
          if (userstate.badges.bits >= 1000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/1";
          if (userstate.badges.bits >= 5000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/1";
          if (userstate.badges.bits >= 10000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/1";
          if (userstate.badges.bits >= 25000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/1";
          if (userstate.badges.bits >= 50000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/62310ba7-9916-4235-9eba-40110d67f85d/1";
          if (userstate.badges.bits >= 75000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/ce491fa4-b24f-4f3b-b6ff-44b080202792/1";
          if (userstate.badges.bits >= 100000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/96f0540f-aa63-49e1-a8b3-259ece3bd098/1";
          if (userstate.badges.bits >= 200000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/4a0b90c4-e4ef-407f-84fe-36b14aebdbb6/1";
          if (userstate.badges.bits >= 300000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/ac13372d-2e94-41d1-ae11-ecd677f69bb6/1";
          if (userstate.badges.bits >= 400000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/a8f393af-76e6-4aa2-9dd0-7dcc1c34f036/1";
          if (userstate.badges.bits >= 500000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/f6932b57-6a6e-4062-a770-dfbd9f4302e5/1";
          if (userstate.badges.bits >= 600000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/4d908059-f91c-4aef-9acb-634434f4c32e/1";
          if (userstate.badges.bits >= 700000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/a1d2a824-f216-4b9f-9642-3de8ed370957/1";
          if (userstate.badges.bits >= 800000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/5ec2ee3e-5633-4c2a-8e77-77473fe409e6/1";
          if (userstate.badges.bits >= 900000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/088c58c6-7c38-45ba-8f73-63ef24189b84/1";
          if (userstate.badges.bits >= 1000000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/494d1c8e-c3b2-4d88-8528-baff57c9bd3f/1";
          if (userstate.badges.bits >= 1250000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/ce217209-4615-4bf8-81e3-57d06b8b9dc7/1";
          if (userstate.badges.bits >= 1500000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/c4eba5b4-17a7-40a1-a668-bc1972c1e24d/1";
          if (userstate.badges.bits >= 1750000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/183f1fd8-aaf4-450c-a413-e53f839f0f82/1";
          if (userstate.badges.bits >= 2000000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/7ea89c53-1a3b-45f9-9223-d97ae19089f2/1";
          if (userstate.badges.bits >= 2500000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/cf061daf-d571-4811-bcc2-c55c8792bc8f/1";
          if (userstate.badges.bits >= 3000000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/5671797f-5e9f-478c-a2b5-eb086c8928cf/1";
          if (userstate.badges.bits >= 3500000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/c3d218f5-1e45-419d-9c11-033a1ae54d3a/1";
          if (userstate.badges.bits >= 4000000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/79fe642a-87f3-40b1-892e-a341747b6e08/1";
          if (userstate.badges.bits >= 4500000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/736d4156-ac67-4256-a224-3e6e915436db/1";
          if (userstate.badges.bits >= 5000000) bits_badge_url = "https://static-cdn.jtvnw.net/badges/v1/3f085f85-8d15-4a03-a829-17fca7bf1bc2/1";

          //full_msg += `<img src="${bits_badge_url}" alt="bits" title="bits"> `;
          full_msg += _createElement.img_string(bits_badge_url, "bits", ['twitch_badges']) + " ";
        }

        //partner
        if (('partner' in userstate.badges) && userstate.badges['partner'] >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1", "partner", ['twitch_badges']) + " ";
        }

        //premium
        if (('premium' in userstate.badges) && userstate.badges['premium'] >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1", "premium", ['twitch_badges']) + " ";
        }

        //turbo
        if (('turbo' in userstate.badges) && userstate.badges['turbo'] >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1", "turbo", ['twitch_badges']) + " ";
        }

        //glhf
        if (('glhf-pledge' in userstate.badges) && userstate.badges['glhf-pledge'] >= 0) {
          //full_msg += `<img src="https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1" alt="glhf-pledge" title="glhf-pledge"> `;
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1", "glhf-pledge", ['twitch_badges']) + " ";
        }

        //glitchcon2020
        if (('glitchcon2020' in userstate.badges) && userstate.badges['glitchcon2020'] >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/1", "glitchcon2020", ['twitch_badges']) + " ";
        }

        //bits-charity
        if (('bits-charity' in userstate.badges) && userstate.badges['bits-charity'] >= 1) {
          full_msg += _createElement.img_string("https://static-cdn.jtvnw.net/badges/v1/a539dc18-ae19-49b0-98c4-8391a594332b/1", "bits-charity", ['twitch_badges']) + " ";
        }
      }

      //是否為mod
      // if(userstate['user-type'] !== null){
      //     //full_msg += `(${userstate['user-type']}) `;
      //     if(userstate['user-type'] === 'mod'){
      //         full_msg += `<img src="https://static-cdn.jtvnw.net/chat-badges/mod.png" alt="mod"> `;
      //     }
      // }

      //是否為訂閱者
      // if(userstate['subscriber'] == true){
      //     full_msg += `<img src="https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1" alt="subscriber"> `;
      // }

      if (userstate.username.toLowerCase() === 'eotones' || is_mod === true) {
        // !f5
        if (message.toLowerCase() === '!f5') {
          browserController.reload(true);
        }
      }

      full_msg += ' ' + _createElement.span_chat_msg(userstate['display-name'], userstate.color, message_with_emotes);

      //醒目標示
      if ('msg-id' in userstate && userstate['msg-id'] == "highlighted-message") {
        chat_container.addChatline(full_msg, ['highlighted_message', `twitch_user_${userstate['user-id']}`, `twitch_msg_id_${userstate['id']}`]);
      } else {
        chat_container.addChatline(full_msg, [`twitch_user_${userstate['user-id']}`, `twitch_msg_id_${userstate['id']}`]);
      }


      //tts
      if (streamerDanmakuSetting.ttsEnabled == true){
        tts.speak2(message);
      }else{
        if (obs_mode == false) {
          if (document.getElementById("ttsCheck").checked == true) {
            tts.speak2(message);
          }
        }
      }
    });

    client.on("cheer", (channel, userstate, message) => {
      console.log(`[cheer userstate]`);
      console.log(userstate);

      //名字顏色
      if (userstate.color == null) {
        userstate.color = '#1dddf8';
      } else if (userstate.color === '#000000') { //因為CSS文字陰影為全黑,如果字也全黑會讓字體難以辨識,所以改成灰色
        userstate.color = '#333333';
      }

      //let _msg = `${userstate['display-name']} 送出 ${userstate.bits}個小奇點`;
      let _msg = _createElement.span_chat_msg(userstate['display-name'], userstate.color, ` 送出 ${userstate.bits}個小奇點`);


      chat_container.addChatline(_msg, ['highlighted_cheer']);
    });

    client.on("clearchat", (channel) => {
      chat_container.clear();
    });

    client.on("hosted", (channel, username, viewers, autohost) => {
      let _msg = `${username} is now hosting my stream with ${viewers} viewers!`;
      chat_container.addChatline(_msg);
    });

    client.on("timeout", (channel, username, reason, duration, userstate) => {
      document.querySelectorAll(`.twitch_user_${userstate["target-user-id"]}`).forEach((elem) => {
        //console.log(elem);
        if (obs_mode == true) {
          elem.parentNode.removeChild(elem);
        } else {
          elem.innerHTML = "(已被刪除)";
        }
      });
    });

    client.on("ban", (channel, username, reason, userstate) => {
      document.querySelectorAll(`.twitch_user_${userstate["target-user-id"]}`).forEach((elem) => {
        //console.log(elem);
        if (obs_mode == true) {
          elem.parentNode.removeChild(elem);
        } else {
          elem.innerHTML = "(已被刪除)";
        }
      });
    });

    client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
      //console.log(`[messagedeleted] `, userstate);
      document.querySelectorAll(`.twitch_msg_id_${userstate["target-msg-id"]}`).forEach((elem) => {
        //console.log(elem);
        if (obs_mode == true) {
          elem.parentNode.removeChild(elem);
        } else {
          elem.innerHTML = "(已被刪除)";
        }
      });
    });

    client.on("raided", (channel, username, viewers) => {
      let _msg = `${username} is raiding with a party of ${viewers}!`;
      chat_container.addChatline(_msg);
    });

    client.on("subscription", (channel, username, method, message, userstate) => {
      let _msg = `${username} 訂閱!`;
      chat_container.addChatline(_msg, ['highlighted_sub']);
    });
  },
  change_channel_btn: function () { //首頁切換頻道按鈕
    let btn_submit = document.getElementById("btn_submit");
    let input_submit = document.getElementById("inputChannel");

    btn_submit.addEventListener("mouseup", function () {
      DEBUG_MODE && console.log("onmouseup");
      DEBUG_MODE && console.log(input_submit.value);
      window.location.hash = `#${input_submit.value}`;
    });

    input_submit.addEventListener("keydown", function (e) {
      //這邊不用submit按鈕是因為submit按鈕不用開javascript就能讓enter鍵觸發表單送出事件,但是這個網頁一定要javascript才能運作,所以故意不用submit
      if (e.code === "Enter" || e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        DEBUG_MODE && console.log("onkeydown");
        DEBUG_MODE && console.log(input_submit.value);
        window.location.hash = `#${input_submit.value}`;
      }
    });
  },
  cssCheck: function () { //檢查用戶自訂的display是否為none,若為none則直接不輸出到網頁上(輸出前判定)
    chat_container.addChatline(`<span class="pod">TEST</span> .kk_chat`, ["kk_chat", "testCSS"]);

    chat_container.addChatline(`<span class="pod">TEST</span> .kk_gift`, ["kk_gift", "testCSS"]);
    chat_container.addChatline(`<span class="pod">TEST</span> .kk_reconn`, ["kk_reconn", "testCSS"]);
    chat_container.addChatline(`<span class="pod">TEST</span> .kk_bana`, ["kk_bana", "testCSS"]);
    chat_container.addChatline(`<span class="pod">TEST</span> .kk_come`, ["kk_come", "testCSS"]);

    //計算OBS版的最大行數
    if (obs_mode === true) {
      this.linesCheck();

      //若視窗大小被改變
      //(正常在OBS下使用不會觸發這個,主要是瀏覽器上測試用)
      window.addEventListener('resize', () => {
        this.linesCheck();
      }, true);
    }

    //全域變數
    cssCheck_kk_gift = !(getComputedStyle(document.querySelector('.kk_gift')).display === 'none');
    cssCheck_kk_reconn = !(getComputedStyle(document.querySelector('.kk_reconn')).display === 'none');
    cssCheck_kk_bana = !(getComputedStyle(document.querySelector('.kk_bana')).display === 'none');
    cssCheck_kk_come = !(getComputedStyle(document.querySelector('.kk_come')).display === 'none');

    //測試完後刪除
    document.querySelectorAll(".testCSS").forEach((e) => {
      e.parentNode.removeChild(e);
    });

    //因為太多館長台的側錄Youtube頻道沒有按照說明文件給的CSS去修改,所以無法正確判定CSS的display是否為'none'
    //所以這裡直接把館長台OBS版頁面CSS判定結果直接定義
    /*
    if(obs_mode===true && exception_room===true){
      cssCheck_kk_gift = false;
      cssCheck_kk_reconn = false;
      cssCheck_kk_bana = false;
      cssCheck_kk_come = false;
    }
    */

    console.log('[cssCheck] kk_gift: ' + cssCheck_kk_gift);
    console.log('[cssCheck] kk_reconn: ' + cssCheck_kk_reconn);
    console.log('[cssCheck] kk_bana: ' + cssCheck_kk_bana);
    console.log('[cssCheck] kk_come: ' + cssCheck_kk_come);

    //elemVisibility.hide( document.getElementById('cssCheck') );
  },
  linesCheck: function () { //計算OBS版的最大行數
    console.log(`[預設聊天室行數] ${chat_limit}`);

    let cssCheck_kk_chat = document.querySelector('.kk_chat');

    if (cssCheck_kk_chat !== null) {
      let cssCheck_one_line_height = cssCheck_kk_chat.scrollHeight;
      let cssCheck_screen_height = window.innerHeight;
      console.log(`[測試單行高度] ${cssCheck_one_line_height}`);
      console.log(`[測試畫面高度] ${cssCheck_screen_height}`);

      let auto_chat_lines = (cssCheck_screen_height / cssCheck_one_line_height).toFixed(0);
      auto_chat_lines = auto_chat_lines * 1.0 + 3; //加3行緩衝
      console.log(`[自動判定聊天室行數] ${auto_chat_lines}`);

      //若在安全範圍內則修改,未在安全範圍內則繼續使用預設值
      if (auto_chat_lines >= 10 && auto_chat_lines <= 100) {
        //全域變數
        chat_limit = auto_chat_lines;
        console.log(`[聊天室行數] ${chat_limit} (修改成功)`);
      } else {
        console.log(`[聊天室行數] ${chat_limit} (未在安全範圍內則繼續使用預設值)`);
      }
    }
  },
  htmlEncode: function (html_c) { //去除XSS字元
    html_c = html_c.toString();
    html_c = html_c.trim();
    return html_c.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  writeToScreen: function (message, class_name_arr) { //將訊息寫入畫面的 div#output 裡
    let pre = document.createElement("div");
    //pre.style.wordWrap = "break-word";
    pre.classList.add("output_lines");
    if (typeof class_name_arr !== "undefined") {
      pre.classList.add(...class_name_arr);
    } else {
      pre.classList.add("kk_chat");
    }

    message = message.trim();
    //pre.innerHTML = message.replace(/\n/g, "<br />"); // 將"\n"轉換成"<br />"
    //pre.innerHTML = `<span class="kk_time">${this.get_time()}</span><span class="kk_border"></span>${message}`;
    pre.innerHTML = `<span class="kk_time kk_pod">${dateTimeString.get_time()}</span>${message}`;

    output.appendChild(pre); //輸出訊息在畫面上

    chat_container.autoScrollToBottom();

    //新方法
    //選while而不用加一刪一是因為要防bug漏算導致越積越多行
    //*目前不確定writeToScreen()如果送出太快太密集會不會導致行數多刪
    while (output.childElementCount > chat_limit) {
      output.removeChild(output.childNodes[0]);
    }

    chat_container.autoScrollToBottom();

    //舊方法
    /*
    //區分瀏覽器版和OBS版的聊天室顯示模式
    if (obs_mode != true) { // 瀏覽器
      //避免訊息過多瀏覽器當掉,超過30000則訊息時清空畫面
      if (chat_i > chat_limit) {
        output.innerHTML = "";
        console.clear();
        chat_i = 0;
      }

      output.appendChild(pre); //輸出訊息在畫面上

      chat_i++; //目前頁面訊息數
    }else{ // OBS
      // first in first out
      output_last_lines.push(pre); //保存最新的n行
      //console.log(output_last_lines.length);
      if(output_last_lines.length > chat_limit){
        output_last_lines.shift(); //清除最舊的一行
        //console.dir(output_last_lines);
      }

      output.innerHTML = "";

      //因為大台實況台刷屏很快的關係(一秒可能十則訊息以上)
      //目前想法是直接控制記憶體中的array變數(first in first out)會比在HTML中執行DOM搜尋穩定
      //所以目前選擇每次送出訊息都整面重繪,而不是DOM搜尋
      //預設為顯示30行,看起來還在可承受範圍內
      //輸出的部份未來有可能會改成setTimeout()或setInterval(),以每秒(或更低)輸出一次來減少使用者端的CPU負載
      let l_html = document.createElement("div");
      for(let fi = 0; fi < output_last_lines.length; fi++){
        l_html.appendChild(output_last_lines[fi]);
      }
      output.appendChild(l_html);
    }
    */
  },
  writeToScreen_v2: function (message, class_name_arr = ["kk_chat"]) {
    let pre = document.createElement("div");
    //pre.style.wordWrap = "break-word";
    pre.classList.add("output_lines");
    pre.classList.add(...class_name_arr);

    message = message.trim();
    //pre.innerHTML = message.replace(/\n/g, "<br />"); // 將"\n"轉換成"<br />"
    //pre.innerHTML = `<span class="kk_time">${this.get_time()}</span><span class="kk_border"></span>${message}`;

    //pre.innerHTML = `<span class="kk_time kk_pod">${this.get_time()}</span>${message}`;
    let ele_span_pod = document.createElement("span");
    ele_span_pod.classList.add("kk_time");
    ele_span_pod.classList.add("kk_pod");
    ele_span_pod.textContent = dateTimeString.get_time();
    pre.appendChild(ele_span_pod);

    let ele_span_msg = document.createElement("span");
    ele_span_msg.innerHTML = message;
    pre.appendChild(ele_span_msg);

    output.appendChild(pre); //輸出訊息在畫面上

    chat_container.autoScrollToBottom();

    //新方法
    //選while而不用加一刪一是因為要防bug漏算導致越積越多行
    //*目前不確定writeToScreen()如果送出太快太密集會不會導致行數多刪
    while (output.childElementCount > chat_limit) {
      output.removeChild(output.childNodes[0]);
    }

    chat_container.autoScrollToBottom();
  },
  numberWithCommas: function (x) { //數字千位加逗點 ( '1000' => '1,000' )
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  display_datetime: function () {
    //
    setInterval(() => {
      //let tool_bar_datetime = document.getElementById("tool_bar_datetime");
      //tool_bar_datetime_span.textContent = `● ${dateTimeString.get_time()}`;
      let datatime_str = `<i class="bi bi-calendar-fill"></i> ${dateTimeString.get_time_full_2()}`;
      if (tool_bar_datetime_span.innerHTML !== datatime_str) { //減少網頁渲染次數
        tool_bar_datetime_span.innerHTML = datatime_str;
      }
    }, 1000);
  },
  pfid_color: function (_pfid) {
    let rel_color = "#ff4c4c";
    if (_pfid && (typeof _pfid == "string" || typeof _pfid == "number")) {
      //let new_color = "#A" + pfid.toString().substr(0, 7);
      let new_color_dec = 16777215 - parseInt(_pfid);
      if (new_color_dec <= 16777215 && new_color_dec >= 0) {
        let new_color_hex = new_color_dec.toString(16);
        if (new_color_hex.length == 6) {
          rel_color = "#" + new_color_hex;
        }
      }
    }

    return rel_color;
  },
  conn_overseas_ws_chat: function () {
    //連接聊天室伺服器(overseas)
    //if(conn_overseas_chat === true){
    //延遲連線避免bug
    setTimeout(() => {
      //webSocket_chat_overseas();
      let ovs = true;
      this.get_langplay_token(ovs);
    }, 10000);
    //}
  },
  log(...message) {
    if (DEBUG_MODE) {
      console.log(message)
    }
  }
};

(function () {
  //程式進入點
  window.addEventListener("load", main.init(), false);
})();