import { Plugin } from '../../../compiled/esbuild'
import { EmiEmitter } from '../utils'
import { CONFIG_REBUILD_EVENT } from '../constants'

// https://github.com/evanw/esbuild/issues/3422
// 需要使用node sync操作，因为go的异步进程会丢失数据
export const esbuildRebuildPlugin: Plugin = {
  name: 'esbuildRebuildPlugin',
  setup({ onEnd }) {
    onEnd(() => {
      EmiEmitter.emit(CONFIG_REBUILD_EVENT)
    })
  },
}
