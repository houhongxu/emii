import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './hello.css'
import { KeepAliveContext } from 'react-router-keep-alive'

const Hello = () => {
  const [text, setText] = useState('Hello Emi!')
  const { dropByPath } = useContext(KeepAliveContext)

  return (
    <>
      <p
        className="red"
        onClick={() => {
          setText('Hi!')
        }}
      >
        {text}
      </p>
      <p onClick={() => dropByPath('/')}>drop / keepalive</p>
      <Link to="/users">Users</Link>
    </>
  )
}
export default Hello
