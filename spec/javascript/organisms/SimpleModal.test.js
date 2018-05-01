import React from 'react'
import renderer from 'react-test-renderer'
import SimpleModal from 'components/organisms/SimpleModal'

describe('SimpleModal', () => {
  const onCloseClick = () => {}
  const onPrimaryClick = () => {}
  const onSecondaryClick = () => {}

  test('it should render status type successfully', () => {
    const isOpen = true
    const wrapper = mount(
        <SimpleModal
          header='Update Status'
          primary='update'
          secondary='cancel'
          isOpen={isOpen}
          onCloseClick={onCloseClick}
          onPrimaryClick={onPrimaryClick}
          onSecondaryClick={onSecondaryClick}
          type='status'>
          <div>content</div>
        </SimpleModal>,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
