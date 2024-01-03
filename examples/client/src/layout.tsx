import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const Layout = () => {
  const { pathname } = useLocation()
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 9,
          display: 'block',
          order: '-1',
          width: '100%',
        }}
      >
        当前路由: {pathname}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 0,
          display: 'block',
          flex: 1,
          width: '100%',
          height: '100%',
          margin: '0!important',
          padding: '0!important',
          overflowY: 'auto',
          touchAction: 'pan-y',
          willChange: 'scroll-position',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}
