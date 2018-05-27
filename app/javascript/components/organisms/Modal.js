import React from 'react'
import ReactModal from 'react-modal'

import Alert from '../organisms/Alert'
import stringUtils from '~/utils/stringUtils'

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
        top: '50%',
        padding: '0px',
        position: 'fixed',
        right: 'auto',
        transform: 'translate(-50%,-50%)',
        width: '600px'
    }
  }
}

class Modal extends React.Component {
  defaultStyleType = 'small'

  render() {
    const { children, isOpen, handleClose, styleType } = this.props
    const style = styleTypes[styleType || this.defaultStyleType]
    return (
      <ReactModal
        isOpen={isOpen}
        style={style}
        onRequestClose={handleClose}
        shouldCloseOnOverlayClick={true}>
        {children}
      </ReactModal>
    )
  }
}

Modal.Body = ({ children, handleClose, hidden }) => (
  <div aria-labelledby="modalTitle" aria-hidden={hidden} role="dialog">
    {children}
    <button className="button button-link close-reveal-modal" aria-label="Close modal" onClick={handleClose}>
      <span className="sr-only">Close</span>
      <span className="ui-icon ui-medium i-primary">
        <svg>
          <use xlinkHref="#i-close"></use>
        </svg>
      </span>
    </button>
  </div>
)

Modal.Header = ({ title }) => (
  <header className="modal-inner margin-top">
    <h1 className="modal-title t-gamma no-margin">{stringUtils.titleize(title)}</h1>
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
