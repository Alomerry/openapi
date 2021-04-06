import {uniqueId} from 'lodash'

// 插件
import demoPlugins from './modules/demo-plugins'
// 组件
import demoComponents from './modules/demo-components'
// 功能
import demoPlayground from './modules/demo-playground'

// 后端
import backend from './backend/backend'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  backend,
  demoComponents,
  demoPlugins,
  demoPlayground
])

let homeHeader = {
  path: '/index',
  title: '首页',
  icon: 'home'
}
// 菜单 顶栏
export const menuHeader = supplementPath([
  homeHeader,
  backend,
  demoPlayground,
  demoComponents,
  demoPlugins
])


