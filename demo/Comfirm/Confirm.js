import React from 'react'
import ReactDOM from 'react-dom'
import './Confirm.css'

export class Confirm extends React.Component  {
  render () {
    return (
      <div className='Modal'>
        <div className='modal-mask'/>
        <div className='modal-container'>
          <div className='modal-content'>
            <p>Confirm：</p>
            {this.props.children}
          </div>
          <div className='modal-footer'>
            <button onClick={this.props.onCancel}>取消</button>
            <button onClick={this.props.onConfirm} className='btn-primary'>确认</button>
          </div>
        </div>
      </div>
    )
  }
}

export default function confirm (content) {  
  const container = document.createElement('div')
  document.body.appendChild(container)
  const clear = () => {
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  }
  const promise = new Promise((resolve, reject) => {
    const onConfirm = () => {
      clear()
      resolve(true)
    }
    const onCancel = () => {
      clear()
      resolve(false)
    }
    ReactDOM.render(
      <Confirm onCancel={onCancel} onConfirm={onConfirm}>{content}</Confirm>,
      container
    )
  })
  return promise
}