<template>
  <d2-container better-scroll type="card">
    <Card>
      <h2 slot="title">弹幕姬</h2>
      <Layout>
        <Sider :style="{background: '#fff'}" hide-trigger>
          <Menu :open-names="['1']" active-name="1-2" theme="light" width="auto">
            <MenuGroup title="弹幕管理">
              <MenuItem name="1">
                <Icon type="md-document"/>
                链接
              </MenuItem>
              <Submenu name="2">
                <template slot="title">
                  <Icon type="ios-navigate"></Icon>
                  样式
                </template>
                <MenuItem name="2-1">布局</MenuItem>
                <MenuItem name="2-2">功能</MenuItem>
              </Submenu>
            </MenuGroup>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                Item 1
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="3">
              <Icon type="ios-keypad"></Icon>
              语音管理
            </MenuItem>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

          <template>
            <Divider class="setting-title" orientation="left">弹幕姬</Divider>
            <Form inline label-position="left">
              <FormItem :label-width="100" label="超链接(代理)" prop="password">
                <Input v-model="obsTwitchUrl" password style="width: 400px" type="password"/>
              </FormItem>
              <FormItem>
                <Button type="success" @click="copyText()">复制</Button>
              </FormItem>
              <FormItem>
                <Button disabled type="warning" @click="">生成</Button>
              </FormItem>
              <!--        <FormItem>-->
              <!--          <Button type="success">Success</Button>-->
              <!--        </FormItem>-->
            </Form>
            <Form inline label-position="left">
              <FormItem :label-width="100" label="超链接(直连)" prop="password">
                <Input v-model="obsTwitchNoProxyUrl" password style="width: 400px" type="password"/>
              </FormItem>
              <FormItem>
                <Button type="success" @click="copyText()">复制</Button>
              </FormItem>
              <FormItem>
                <Button disabled type="warning" @click="">生成</Button>
              </FormItem>
              <!--        <FormItem>-->
              <!--          <Button type="success">Success</Button>-->
              <!--        </FormItem>-->
            </Form>
          </template>

          <template>
            <Divider class="setting-title" orientation="left">功能</Divider>
            <Form inline label-position="left">
              <FormItem :label-width="100" label="超链接(代理)" prop="password">
                <Input v-model="obsTwitchUrl" password style="width: 400px" type="password"/>
              </FormItem>
              <FormItem>
                <Button type="success" @click="copyText()">复制</Button>
              </FormItem>
              <FormItem>
                <Button disabled type="warning" @click="">生成</Button>
              </FormItem>
              <!--        <FormItem>-->
              <!--          <Button type="success">Success</Button>-->
              <!--        </FormItem>-->
            </Form>
            <Form inline label-position="left">
              <FormItem :label-width="100" label="超链接(直连)" prop="password">
                <Input v-model="obsTwitchNoProxyUrl" password style="width: 400px" type="password"/>
              </FormItem>
              <FormItem>
                <Button type="success" @click="copyText()">复制</Button>
              </FormItem>
              <FormItem>
                <Button disabled type="warning" @click="">生成</Button>
              </FormItem>
              <!--        <FormItem>-->
              <!--          <Button type="success">Success</Button>-->
              <!--        </FormItem>-->
            </Form>
          </template>

          <template>
            <Divider class="setting-title" orientation="left">语音播放</Divider>
            是否开启
            <span>
            <i-switch size="large">
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch>
          </span>
            <Divider class="setting-title" orientation="left">语音语种</Divider>
            <span>
              <Button ghost type="success" @click="playTTS">Play</Button>&nbsp;
              <Select v-model="setting.danmakuSetting.ttsType" filterable style="width:200px">
                <div slot="empty">not Found data</div>
                <Option v-for="item in ttsTypes" :key="item.value" :value="item.value">{{ item.label }}</Option>
              </Select>
          </span>
          </template>
        </Content>
      </Layout>
    </Card>

  </d2-container>
</template>
<script>
import * as clipboard from 'clipboard-polyfill'
import util from "@/libs/util";
import {mapState} from 'vuex'

export default {
  name: 'backend-components-danmaku',
  data() {
    return {
      ttsTypes: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],

      obsTwitchUrl: "",
      obsTwitchNoProxyUrl: "",
      setting: {
        danmakuSetting: {
          messageFontStyle: null, // 弹幕字体
          showHeadImg: false, // 是否展示弹幕头像
          needShowIcons: false, // 需要展示的徽章图标
          showMessageTime: false, // 是否展示弹幕发送时间
          showViewerNumber: false, // 是否展示观看人数
          messageAnimation: null, // 弹幕动画效果
          ttsEnabled: false, // 是否开启语音播放
          ttsType: null, // 语音语种
        }
      }
    }
  },
  mounted() {
    this.getDanmakuUrl()
  },
  methods: {
    getDanmakuUrl() {
      this.$api.GET_DANMAKU_URL_AJAX(util.cookies.get('token')).then(res => {
        this.obsTwitchUrl = "https://chat.alomerry.com/#twitch:" + res.danmakuUrl;
        this.obsTwitchNoProxyUrl = "https://chat.alomerry.com/chat.html#twitch:" + res.danmakuUrl;
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
    playTTS() {
      try {
        util.tts.speak(`你好 ${this.info.name} ，今天天气真不错`, this.setting.danmakuSetting.ttsType)
      } catch (e) {
        this.$message.error("Please select one language.")
      }
    },
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
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
