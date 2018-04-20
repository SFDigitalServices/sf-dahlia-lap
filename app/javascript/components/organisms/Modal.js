import React from 'react'

const Modal = ({ header, hidden, content, primary, secondary }) => {
  return (
    <div aria-labelledby="modalTitle" aria-hidden={hidden} role="dialog">
      <header className="modal-inner">
        <h1 className="modal-title t-gamma no-margin">{header}</h1>
      </header>

      <section className="modal-inner">
        <p className="c-steel">{content}</p>
      </section>

      <footer className="modal-footer bg-dust">
        <div className="modal-button-group row">
          <div className="modal-button_item">
            <button className="button primary">{primary}</button>
          </div>
          <div className="modal-button_item">
            <button className="button no-border">{secondary}</button>
          </div>
        </div>
      </footer>

      <a className="close-reveal-modal" aria-label="Close">
        <span className="ui-icon ui-medium i-primary">
          <svg>
            <use xlinkHref="#i-close"></use>
          </svg>
        </span>
      </a>
    </div>
  )
}

export default Modal