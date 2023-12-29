import React from 'react'
import ReactDOM from 'react-dom/client'

const Hello = () => {
  const [text, setText] = React.useState('Hello Emi!')

  return (
    <span
      className="red"
      onClick={() => {
        setText('Hi!')
      }}
    >
      {text}
    </span>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(React.createElement(Hello))
