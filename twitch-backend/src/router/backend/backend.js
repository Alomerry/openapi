import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}

export default {
  path: '/backend',
  name: 'backend-components',
  meta,
  redirect: {name: 'backend-home'},
  component: layoutHeaderAside,
  children: [
    {
      path: 'alert-box',
      name: 'backend-components-json-tree',
      component: _import('backend/alert-box'),
      meta: {...meta, title: '通知框'}
    },
    {
      path: 'index',
      name: 'backend-components-index',
      component: _import('backend/index'),
      meta: {...meta, title: '组件首页'}
    },
    {
      path: 'danmaku',
      name: 'backend-components-danmaku',
      component: _import('backend/danmaku'),
      meta: {...meta, title: '弹幕'}
    },
    {
      path: 'preview',
      name: 'backend-components-preview',
      component: _import('backend/preview'),
      meta: {...meta, title: '预览'}
    },
    {
      path: 'subtitles',
      name: 'backend-components-subtitles',
      component: _import('backend/subtitles'),
      meta: {...meta, title: '字幕'}
    },
  ]
}
