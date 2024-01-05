// 通过路由进行keepalive
// 组件级别可以使用库 react-activation，但是是hack实现，有react兼容问题
import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useRef,
} from 'react'
import { FunctionComponent } from 'react'
import { useLocation, useOutlet, matchPath } from 'react-router-dom'

interface KeepAliveLayoutProps {
  /**
   * 匹配路径的数组
   */
  keepalivePaths: (string | RegExp)[]
}

interface KeepAliveProps extends KeepAliveLayoutProps {
  /**
   * keepalive中的react组件
   */
  keepaliveElementsRef: MutableRefObject<Record<string, ReactNode>>

  /**
   * 通过路径移除keepalive的react组件
   */
  dropByPath: (path: string) => void
}

const KeepAliveContext = createContext<KeepAliveProps>({
  keepalivePaths: [],
  keepaliveElementsRef: { current: {} },
  dropByPath: () => {},
})

/**
 * 为子组件提供KeepAliveContext
 */
const KeepAliveLayout: FunctionComponent<
  PropsWithChildren<KeepAliveLayoutProps>
> = (props) => {
  // rest包含children子组件
  const { keepalivePaths, ...rest } = props

  const keepaliveElementsRef = useRef<any>({})

  function dropByPath(path: string) {
    keepaliveElementsRef.current[path] = null
  }

  return (
    <KeepAliveContext.Provider
      value={{ keepalivePaths, keepaliveElementsRef, dropByPath }}
      {...rest}
    />
  )
}

/**
 * 获取keepalive后的react组件
 */
const useKeepaliveOutlets = () => {
  const location = useLocation()
  const element = useOutlet()

  const { keepalivePaths, keepaliveElementsRef } =
    useContext<KeepAliveProps>(KeepAliveContext)

  const isKeep = isKeepPath(keepalivePaths, location.pathname)

  // 每次访问react组件将react组件存入keepaliveElementsRef
  if (isKeep) {
    keepaliveElementsRef.current[location.pathname] = element
  }

  // keepalive组件，遍历keepaliveElementsRef中的组件，将与路由匹配的那个组件渲染显示，其他渲染hidden
  // 非keepalive组件，直接正常渲染
  return (
    <>
      {Object.entries(keepaliveElementsRef.current).map(
        ([pathname, element]: any) => (
          <div
            hidden={!matchPath(location.pathname, pathname)}
            key={pathname}
            style={{
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'hidden auto',
            }}
            className="rumtime-keep-alive-layout"
          >
            {element}
          </div>
        ),
      )}
      <div
        hidden={isKeep}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden auto',
        }}
        className="rumtime-keep-alive-layout-no"
      >
        {!isKeep && element}
      </div>
    </>
  )
}

const isKeepPath = (keepalivePaths: any[], path: string) => {
  let isKeep = false

  keepalivePaths.map((item) => {
    if (item instanceof RegExp && item.test(path)) {
      isKeep = true
    }
    if (
      typeof item === 'string' &&
      (item.toLowerCase() === path || item === path)
    ) {
      isKeep = true
    }
  })

  return isKeep
}

export { KeepAliveLayout, useKeepaliveOutlets, KeepAliveContext }
