import React from 'react'
import { shallow } from 'enzyme'
import AppCard from 'components/molecules/AppCard'

describe('AppCard', () => {
  test('it renders the correct children', () => {
    const wrapper = shallow(
      <AppCard>
        <div className='testClassName' />
      </AppCard>
    )
    expect(wrapper.find('.testClassName').exists()).toBeTruthy()
  })
})
