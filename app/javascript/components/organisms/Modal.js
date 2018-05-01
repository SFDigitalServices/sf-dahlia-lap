import React from 'react'
import Icon from '../atoms/Icon'
import ReactModal from 'react-modal';
import _ from 'lodash'

import Alert from '../organisms/Alert'

const styleTypes = {
  small: {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    content: {
        opacity: '1',
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        padding: '0px',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        minWidth: '20rem',
        width: '600px',
        maxWidth: '60rem'
    }
  }
}

const titileize = (value) =>  _.capitalize(value)

class Modal extends React.Component {
  defaultStyleType = 'small'

  render() {
    const { children, isOpen, styleType } = this.props
    const style = styleTypes[styleType || this.defaultStyleType]

    return (
      <ReactModal isOpen={isOpen} style={style} >
        {children}
      </ReactModal>
    )
  }
}

Modal.Body = ({ children, onCloseClick, hidden }) => (
  <div aria-labelledby="modalTitle" aria-hidden={hidden} role="dialog">
    {children}
    <a className="close-reveal-modal" aria-label="Close modal" onClick={onCloseClick}>
      <span className="ui-icon ui-medium i-primary">
        <svg>
          <use xlinkHref="#i-close"></use>
        </svg>
      </span>
    </a>
  </div>
)

Modal.Header = ({ title }) => (
  <header className="modal-inner">
    <h1 className="modal-title t-gamma no-margin">{titileize(title)}</h1>
  </header>
)

Modal.Content = ({ children }) => (
  <section className="modal-inner">
    {children}
  </section>
)

Modal.Footer = ({ children }) => (
  <footer className="modal-footer bg-dust">
    <div className="modal-button-group row">
      { children }
    </div>
  </footer>
)

Modal.Alert = (props) => {
  return (<Alert {...props} />)
}

export default Modal
