<template>
  <d2-container better-scroll type="card">
    <h2 slot="header">弹幕姬</h2>
    <Card>
      <Form inline label-position="left">
        <FormItem :label-width="100" prop="password" label="弹幕姬超链接">
          <Input v-model="obsTwitchUrl" type="password" password style="width: 400px"/>
        </FormItem>
        <FormItem>
          <Button type="success" @click="copyText()">复制</Button>
        </FormItem>
        <FormItem>
          <Button type="warning" @click="getDanmakuUrl()">生成</Button>
        </FormItem>
        <!--        <FormItem>-->
        <!--          <Button type="success">Success</Button>-->
        <!--        </FormItem>-->
      </Form>
    </Card>
  </d2-container>
</template>
<script>
import * as clipboard from 'clipboard-polyfill'
import {mapState, mapActions} from 'vuex'
import util from "@/libs/util";

export default {
  name: 'backend-components-danmaku',
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
        this.obsTwitchUrl = "https://chat.alomerry.com/#twitch:"+res.danmakuUrl;
      })
    },
    copyText() {
      clipboard.writeText(this.obsTwitchUrl).then((res) => {
        this.$Message.success({
          content: '复制成功',
          duration: 3,
          closable: true
        });
      }, err => {
        this.$Message.error({
          content: err,
          duration: 3,
        });
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.page {
  background-blend-mode: multiply, multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .page_title {
    font-size: 20px;
    color: #303133;
  }
}
</style>
