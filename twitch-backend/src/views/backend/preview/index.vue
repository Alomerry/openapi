<template>
  <d2-container-frame :src="obsTwitchUrl"/>
</template>

<script>

import util from "@/libs/util";

export default {
  name: 'backend-components-preview',
  data() {
    return {
      obsTwitchUrl: "",
    }
  },
  mounted() {
    this.getDanmakuUrl()
  },
  methods: {
    getDanmakuUrl() {
      this.$api.GET_DANMAKU_URL_AJAX(util.cookies.get('token')).then(res => {
        this.obsTwitchUrl = "https://chat.alomerry.com/preview.html#twitch:" + res.danmakuUrl;
      })
    },
  }
}
</script>
