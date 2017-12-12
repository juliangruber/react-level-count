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
    if (!key.startsWith(this.props.prefix)) return
    if (!this.keys[key] && this.props.filter({ key, value })) {
      this.keys[key] = true
      this.setState({ count: this.state.count + 1 })
    } else if (this.keys[key] && !this.props.filter({ key, value })) {
      this.ondel(key)
    }
  }

  ondel (key) {
    if (key.startsWith(this.props.prefix) && this.keys[key]) {
      delete this.keys[key]
      this.setState({ count: this.state.count - 1 })
    }
  }

  componentDidMount () {
    this.props.db.createReadStream({
      start: this.props.prefix,
      end: `${this.props.prefix}~`
    }).on('data', ({ key, value }) => this.onput(key, value))
    this.props.db.on('put', this.onput)
    this.props.db.on('del', this.ondel)
  }

  componentWillUnmount () {
    this.props.db.removeListener('put', this.onput)
    this.props.db.removeListener('del', this.ondel)
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
