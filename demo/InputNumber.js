import React from 'react'

export default class InputNumber extends React.Component  {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value !== undefined ? props.value : props.defaultValue
    }
  }
  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
  }
  handleChange = (e) => {
    e.persist()
    const value = e.target.value
    this.setState({ value }, () => {
      this.props.onChange && this.props.onChange(e)
    })
  }
  render () {
    return (
      <input type='number' value={this.state.value} onChange={this.handleChange}/>
    )
  }
}