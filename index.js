import React from 'react'

export class Count extends React.Component {
  constructor () {
    super()
    this.state = { count: 0 }
    this.onput = this.onput.bind(this)
    this.ondel = this.ondel.bind(this)
    this.keys = {}
  }

  onput (key, value) {
    if (key.startsWith(this.props.prefix)) {
      if (!this.keys[key] && this.props.filter({ key, value })) {
        this.keys[key] = true
        this.setState({ count: this.state.count + 1 })
      } else {
        this.ondel(key)
      }
    }
  }

  ondel (key) {
    if (key.startsWith(this.props.prefix) && this.keys[key]) {
      delete this.keys[key]
      this.setState({ count: this.state.count - 1 })
    }
  }

  componentDidMount () {
    this.db.createReadStream({
      start: this.props.prefix,
      end: `${this.props.prefix}~`
    }).on('data', ({ key }) => this.onput(key))
    this.db.on('put', this.onput)
    this.db.on('del', this.ondel)
  }

  componentWillUnmount () {
    this.db.removeListener('put', this.onput)
    this.db.removeListener('del', this.ondel)
  }

  render () {
    return this.props.render(this.state.count)
  }
}

Count.defaultProps = {
  render: count => count,
  filter: () => true,
  prefix: ''
}
