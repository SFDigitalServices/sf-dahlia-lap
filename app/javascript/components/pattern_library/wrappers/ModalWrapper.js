import React from 'react'

import SimpleModal from 'components/organisms/SimpleModal'

class ModalWrapper extends React.Component {
  state = {
    statusModalIsOpen: false,
    dangerModalIsOpen: false,
    invertModalIsOpen: false
  }

  openStatusModal = () => this.setState({ statusModalIsOpen: true })

  closeStatusModal = () => this.setState({ statusModalIsOpen: false })

  openDangerModal = () => this.setState({ dangerModalIsOpen: true })

  closeDangerModal = () => this.setState({ dangerModalIsOpen: false })

  openInvertModal = () => this.setState({ invertModalIsOpen: true })

  closeInvertModal = () => this.setState({ invertModalIsOpen: false })

  render() {
    return (
      <div>
        <button onClick={this.openStatusModal}>Open Update Status Modal</button>
        <SimpleModal
          header='Update Status'
          primary='update'
          secondary='cancel'
          isOpen={this.state.statusModalIsOpen}
          handleClose={this.closeStatusModal}
          onPrimaryClick={this.closeStatusModal}
          onSecondaryClick={this.closeStatusModal}
          type='status'
        >
          <p className='c-steel'>Loreum ipsum</p>

          <div className='form-group'>
            <label>Comment Required</label>
            <textarea
              name='textarea-id'
              id='textarea-id'
              cols='30'
              rows='10'
              placeholder='Type here'
              aria-describedby='described-id'
            />
          </div>
        </SimpleModal>

        <br />

        <button onClick={this.openDangerModal}>Open Danger Modal</button>
        <SimpleModal
          header='Remove loterry prefrence?'
          primary='remove'
          secondary='cancel'
          isOpen={this.state.dangerModalIsOpen}
          handleClose={this.closeDangerModal}
          onPrimaryClick={this.closeDangerModal}
          onSecondaryClick={this.closeDangerModal}
          type='alert'
          invert={false}
          alert={{
            title: "This change will affect this application's preferences",
            subtitle: 'This application would no longer be eligible for Live Work Preference',
            message:
              'Note, you will have the opportunity to grant another household member this preference',
            invert: false
          }}
        >
          <div>content</div>
        </SimpleModal>

        <br />

        <button onClick={this.openInvertModal}>Open Invert Modal</button>
        <SimpleModal
          header='Remove loterry prefrence? Invert Modal'
          primary='remove'
          secondary='cancel'
          isOpen={this.state.invertModalIsOpen}
          handleClose={this.closeInvertModal}
          onPrimaryClick={this.closeInvertModal}
          onSecondaryClick={this.closeInvertModal}
          type='alert'
          invert
          alert={{
            title: "This change will affect this application's preferences",
            subtitle: 'This application woudl no longer be elegible for Live Work Preference',
            message:
              'Note, you will have the opportunity to grant another household member this preference',
            invert: true
          }}
        >
          <div>content</div>
        </SimpleModal>
      </div>
    )
  }
}

export default ModalWrapper
