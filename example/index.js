import React from 'react'
import ReactDOM from 'react-dom'
import level from 'level'
import { Count } from '..'

const db = window.db = level('/tmp/preact-level-count')

class Example extends React.Component {
  add () {
    db.put(`prefix${Date.now()}${Math.random()}`, '')
  }
  render () {
    return (
      <div>
        Push this button:<br />
        <button onClick={ this.add }>Add a value!</button><br /><br />
        Or execute this snippet in the console:<br />
        <pre>db.put(`prefix${'{Date.now()}'}${'{Math.random()}'}`, '')</pre><br />
        Live count:{' '}
        <Count
          db={db}
          prefix="prefix"
          render={val => <strong>{val}</strong>}
        />
      </div>
    )
  }
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<Example />, container)
