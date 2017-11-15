import React from 'react'

export class Count extends React.Component {
  constructor ({ db, prefix }) {
    super()
    this.state = { count: 0 }
    this.onput = this.onput.bind(this)
    this.ondel = this.ondel.bind(this)
    this.db = db
    this.prefix = prefix
    this.keys = {}
  }

  onput (key) {
    if (key.startsWith(this.prefix) && !this.keys[key]) {
      this.keys[key] = true
      this.setState({ count: this.state.count + 1 })
    }
  }
  
  ondel (key) {
    if (key.startsWith(this.prefix) && this.keys[key]) {
      delete this.keys[key]
      this.setState({ count: this.state.count - 1 })
    }
  }

  componentDidMount () {
    this.db.createReadStream({
      start: this.prefix,
      end: `${this.prefix}~`
    }).on('data', ({ key }) => this.onput(key))
    this.db.on('put', this.onput)
    this.db.on('del', this.ondel)
  }

  componentWillUnmount () {
    this.db.removeListener('put', this.onput)
    this.db.removeListener('del', this.ondel)
  }

  render () {
    return this.state.count
  }
}
