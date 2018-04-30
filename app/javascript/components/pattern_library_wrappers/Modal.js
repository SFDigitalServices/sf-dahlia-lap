import React from 'react'
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import SimpleModal from 'components/organisms/SimpleModal'

class ModalWrapper extends React.Component {
  constructor() {
    super()

    this.state = {
      statusModalIsOpen: false,
      dangerModalIsOpen: false
    };

    this.openStatusModal = this.openStatusModal.bind(this)
    // this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeStatusModal = this.closeStatusModal.bind(this)

    this.openDangerModal = this.openDangerModal.bind(this)
    this.closeDangerModal = this.closeDangerModal.bind(this)
  }

  openStatusModal() {
    this.setState({statusModalIsOpen: true});
  }

  closeStatusModal() {
    this.setState({statusModalIsOpen: false});
  }

  openDangerModal() {
    this.setState({dangerModalIsOpen: true});
  }

  closeDangerModal() {
    this.setState({dangerModalIsOpen: false});
  }

  render() {
    return (
      <div>
        <button onClick={this.openStatusModal}>Open Update Status Modal</button>
        <SimpleModal
          header='Update Status'
          primary='update'
          secondary='cancel'
          isOpen={this.state.statusModalIsOpen}
          onCloseClick={() => this.closeStatusModal()}
          onPrimaryClick={() => this.closeStatusModal()}
          onSecondaryClick={() => this.closeStatusModal()}
          type='status'>
          <div>content</div>
        </SimpleModal>
        <br/>

        <button onClick={this.openDangerModal}>Open Danger Modal</button>
        <SimpleModal
          header='Remove loterry prefrence?'
          primary='remove'
          secondary='cancel'
          isOpen={this.state.dangerModalIsOpen}
          onCloseClick={() => this.closeDangerModal()}
          onPrimaryClick={() => this.closeDangerModal()}
          onSecondaryClick={() => this.closeDangerModal()}
          type='alert'
          alertBox="This change will affect this application's preferences"
          alertNotice={ {
            title: 'This application woudl no longer be elegible for Live Work Preference',
            content: 'Note, you will have the opportunity to grant another household member this preference'
          }}>
          <div>content</div>
        </SimpleModal>

        <br/>
        <button onClick={this.openDangerModal}>Open Invert Modal</button>
        <SimpleModal
          header='Remove loterry prefrence?'
          primary='remove'
          secondary='cancel'
          isOpen={this.state.dangerModalIsOpen}
          onCloseClick={() => this.closeDangerModal()}
          onPrimaryClick={() => this.closeDangerModal()}
          onSecondaryClick={() => this.closeDangerModal()}
          type='alert'
          alertBox="This change will affect this application's preferences"
          alertNotice={ {
            title: 'This application woudl no longer be elegible for Live Work Preference',
            content: 'Note, you will have the opportunity to grant another household member this preference'
          }}>
          <div>content</div>
        </SimpleModal>
      </div>
    )
  }
}

export default ModalWrapper
