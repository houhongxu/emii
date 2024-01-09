import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { createElement } from 'react'
import { Hello } from './pages/hello'
import { Users } from './pages/users'
import { Me } from './pages/me'
import { KeepAliveLayout } from 'react-router-keep-alive'

const App = () => {
  return (
    <KeepAliveLayout keepalivePaths={['/']}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Hello />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </KeepAliveLayout>
  )
}

const root = createRoot(document.getElementById('root')!)

root.render(createElement(App))
