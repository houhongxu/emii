import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Layout } from './layout'
import { createElement, useState } from 'react'
import {
  KeepAliveLayout,
  useKeepaliveOutlets,
} from '../../../packages/react-keep-router-alive/lib'

const Hello = () => {
  const [text, setText] = useState('Hello Emi!')

  return (
    <>
      <p
        onClick={() => {
          setText('Hi!')
        }}
      >
        {text}
      </p>
      <Link to="/users">Users</Link>
    </>
  )
}

const Users = () => {
  return (
    <>
      <p> Users </p>
      <Link to="/me">Me</Link>
    </>
  )
}

const Me = () => {
  return (
    <>
      <p> Me </p>
      <Link to="/">go Home</Link>
    </>
  )
}

const App = () => {
  return (
    <KeepAliveLayout keepalivePaths={['/']}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
