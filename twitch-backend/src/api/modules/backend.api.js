import {find, map, random} from 'lodash'

const businessIssue142Db = [
  {id: '1', name: '用户 1', address: '上海市普陀区金沙江路 1518 弄'},
  {id: '2', name: '用户 2', address: '上海市普陀区金沙江路 1517 弄'},
  {id: '3', name: '用户 3', address: '上海市普陀区金沙江路 1519 弄'},
  {id: '4', name: '用户 4', address: '上海市普陀区金沙江路 1516 弄'}
]

export default ({service, request, serviceForMock, requestForMock, mock, faker, tools}) => ({
  /**
   * @description 错误日志示例 请求一个不存在的地址
   */
  GET_DANMAKU_URL_AJAX(token) {
    return request({
      url: '/getDanmakuUrl',
      headers: {
        "accessToken": token
      },
      method: 'get'
    })
  },
})
