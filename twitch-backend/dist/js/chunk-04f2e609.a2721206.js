(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-04f2e609"],{"272f":function(t,s,e){"use strict";var r=e("1fba");s["a"]={props:{betterScrollOptions:{type:Object,required:!1,default:function(){return{}}}},data:function(){return{BS:null}},mounted:function(){this.scrollInit()},beforeDestroy:function(){this.scrollDestroy()},methods:{scrollInit:function(){var t=this;this.BS=new r["a"](this.$refs.wrapper,Object.assign({mouseWheel:!0,click:!0,scrollbar:{fade:!0,interactive:!1}},this.betterScrollOptions)),this.BS.on("scroll",(function(s){var e=s.x,r=s.y;return t.$emit("scroll",{x:-e,y:-r})}))},scrollDestroy:function(){try{this.BS.destroy()}catch(t){delete this.BS,this.BS=null}},scrollToTop:function(){this.BS&&this.BS.scrollTo(0,0,300)},scroll:function(){this.BS&&this.$emit("scroll",{x:-this.BS.x,y:-this.BS.y})}}}},8221:function(t,s,e){"use strict";e.r(s);var r=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"d2-container-card-bs"},[t.$slots.header?e("div",{ref:"header",staticClass:"d2-container-card-bs__header"},[t._t("header")],2):t._e(),e("div",{ref:"wrapper",staticClass:"d2-container-card-bs__body"},[e("div",{staticClass:"d2-container-card-bs__body-wrapper-inner"},[e("div",{staticClass:"d2-container-card-bs__body-card"},[t._t("default")],2)])]),t.$slots.footer?e("div",{ref:"footer",staticClass:"d2-container-card-bs__footer"},[t._t("footer")],2):t._e()])},i=[],n=e("272f"),o={name:"d2-container-card-bs",mixins:[n["a"]]},c=o,a=e("2877"),l=Object(a["a"])(c,r,i,!1,null,null,null);s["default"]=l.exports}}]);