(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-843329b0"],{"006e":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("d2-container",{attrs:{"better-scroll":"",type:"card"}},[n("h2",{attrs:{slot:"header"},slot:"header"},[t._v("弹幕姬")]),n("Card",[n("Form",{attrs:{inline:"","label-position":"left"}},[n("FormItem",{attrs:{"label-width":100,prop:"password",label:"弹幕姬超链接"}},[n("Input",{staticStyle:{width:"400px"},attrs:{type:"password",password:""},model:{value:t.obsTwitchUrl,callback:function(e){t.obsTwitchUrl=e},expression:"obsTwitchUrl"}})],1),n("FormItem",[n("Button",{attrs:{type:"success"},on:{click:function(e){return t.copyText()}}},[t._v("复制")])],1),n("FormItem",[n("Button",{attrs:{type:"warning"},on:{click:function(e){return t.getDanmakuUrl()}}},[t._v("生成")])],1)],1)],1)],1)},o=[],i=n("2af7"),a=n("c276"),c={name:"backend-components-danmaku",data:function(){return{obsTwitchUrl:""}},mounted:function(){this.getDanmakuUrl()},methods:{getDanmakuUrl:function(){var t=this;this.$api.GET_DANMAKU_URL_AJAX(a["a"].cookies.get("token")).then((function(e){t.obsTwitchUrl="https://chat.alomerry.com/#twitch:"+e.danmakuUrl}))},copyText:function(){var t=this;i["e"](this.obsTwitchUrl).then((function(e){t.$Message.success({content:"复制成功",duration:3,closable:!0})}),(function(e){t.$Message.error({content:e,duration:3})}))}}},u=c,s=(n("efef"),n("2877")),l=Object(s["a"])(u,r,o,!1,null,"4cd42314",null);e["default"]=l.exports},"2af7":function(t,e,n){"use strict";function r(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{u(r.next(t))}catch(t){i(t)}}function c(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){t.done?o(t.value):new n((function(e){e(t.value)})).then(a,c)}u((r=r.apply(t,e||[])).next())}))}function o(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}n.d(e,"a",(function(){return u})),n.d(e,"b",(function(){return m})),n.d(e,"c",(function(){return w})),n.d(e,"d",(function(){return f})),n.d(e,"e",(function(){return h}));var i=["text/plain","text/html"],a=function(){(console.warn||console.log).call(arguments)}.bind(console,"[clipboard-polyfill]"),c=!0,u=function(){function t(){this.m={}}return t.prototype.setData=function(t,e){c&&-1===i.indexOf(t)&&a("Unknown data type: "+t,"Call clipboard.suppressWarnings() to suppress this warning."),this.m[t]=e},t.prototype.getData=function(t){return this.m[t]},t.prototype.forEach=function(t){for(var e in this.m)t(this.m[e],e)},t}(),s=function(t){},l=!0,d=function(){(console.warn||console.log).apply(console,arguments)}.bind("[clipboard-polyfill]"),p="text/plain";function f(t){return r(this,void 0,void 0,(function(){var e;return o(this,(function(n){if(l&&!t.getData(p)&&d("clipboard.write() was called without a `text/plain` data type. On some platforms, this may result in an empty clipboard. Call clipboard.suppressWarnings() to suppress this warning."),D()){if(function(t){var e=t.getData(p);if(void 0!==e)return window.clipboardData.setData("Text",e);throw new Error("No `text/plain` value was specified.")}(t))return[2];throw new Error("Copying failed, possibly because the user rejected it.")}if(b(t))return s("regular execCopy worked"),[2];if(navigator.userAgent.indexOf("Edge")>-1)return s('UA "Edge" => assuming success'),[2];if(y(document.body,t))return s("copyUsingTempSelection worked"),[2];if(function(t){var e=document.createElement("div");e.setAttribute("style","-webkit-user-select: text !important"),e.textContent="temporary element",document.body.appendChild(e);var n=y(e,t);return document.body.removeChild(e),n}(t))return s("copyUsingTempElem worked"),[2];if(void 0!==(e=t.getData(p))&&function(t){s("copyTextUsingDOM");var e=document.createElement("div");e.setAttribute("style","-webkit-user-select: text !important");var n=e;e.attachShadow&&(s("Using shadow DOM."),n=e.attachShadow({mode:"open"}));var r=document.createElement("span");r.innerText=t,n.appendChild(r),document.body.appendChild(e),g(r);var o=document.execCommand("copy");return x(),document.body.removeChild(e),o}(e))return s("copyTextUsingDOM worked"),[2];throw new Error("Copy command failed.")}))}))}function h(t){return r(this,void 0,void 0,(function(){return o(this,(function(e){return navigator.clipboard&&navigator.clipboard.writeText?(s("Using `navigator.clipboard.writeText()`."),[2,navigator.clipboard.writeText(t)]):[2,f(k(t))]}))}))}function m(){return r(this,void 0,void 0,(function(){var t;return o(this,(function(e){switch(e.label){case 0:return t=k,[4,w()];case 1:return[2,t.apply(void 0,[e.sent()])]}}))}))}function w(){return r(this,void 0,void 0,(function(){return o(this,(function(t){if(navigator.clipboard&&navigator.clipboard.readText)return s("Using `navigator.clipboard.readText()`."),[2,navigator.clipboard.readText()];if(D())return s("Reading text using IE strategy."),[2,T()];throw new Error("Read is not supported in your browser.")}))}))}var v=function(){this.success=!1};function b(t){var e=new v,n=function(t,e,n){s("listener called"),t.success=!0,e.forEach((function(e,r){var o=n.clipboardData;o.setData(r,e),r===p&&o.getData(r)!==e&&(s("setting text/plain failed"),t.success=!1)})),n.preventDefault()}.bind(this,e,t);document.addEventListener("copy",n);try{document.execCommand("copy")}finally{document.removeEventListener("copy",n)}return e.success}function y(t,e){g(t);var n=b(e);return x(),n}function g(t){var e=document.getSelection();if(e){var n=document.createRange();n.selectNodeContents(t),e.removeAllRanges(),e.addRange(n)}}function x(){var t=document.getSelection();t&&t.removeAllRanges()}function k(t){var e=new u;return e.setData(p,t),e}function D(){return"undefined"==typeof ClipboardEvent&&void 0!==window.clipboardData&&void 0!==window.clipboardData.setData}function T(){return r(this,void 0,void 0,(function(){var t;return o(this,(function(e){if(""===(t=window.clipboardData.getData("Text")))throw new Error("Empty clipboard or could not read plain text from clipboard");return[2,t]}))}))}},"809f":function(t,e,n){},efef:function(t,e,n){"use strict";n("809f")}}]);