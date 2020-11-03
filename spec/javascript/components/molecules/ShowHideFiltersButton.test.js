import React from 'react'
import { shallow } from 'enzyme'
import Button from '~/components/atoms/Button'
import StyledIcon from '~/components/atoms/StyledIcon'
import ShowHideFiltersButton from '~/components/molecules/ShowHideFiltersButton'

describe('ShowHideFiltersButton', () => {
  test('it renders properly with default props', () => {
    const wrapper = shallow(<ShowHideFiltersButton />)
    expect(wrapper.find(Button).props().text).toEqual('Show Filters')
    expect(wrapper.find(Button).props().iconRight).toBeNull()
    expect(wrapper.find(Button).props().iconLeft).not.toBeNull()
    expect(wrapper.find(Button).props().minWidthPx).toEqual('195px')
  })

  test('it renders properly when isShowingFilters=true', () => {
    const wrapper = shallow(<ShowHideFiltersButton isShowingFilters />)
    expect(wrapper.find(Button).props().text).toEqual('Hide Filters')
    expect(wrapper.find(Button).props().iconRight).toBeNull()
    expect(wrapper.find(Button).props().iconLeft).not.toBeNull()
    expect(wrapper.find(Button).props().minWidthPx).toEqual('195px')
  })

  test('it renders properly when numFiltersApplied=4', () => {
    const wrapper = shallow(<ShowHideFiltersButton isShowingFilters numFiltersApplied={4} />)
    expect(wrapper.find(Button).props().iconRight).toEqual(<StyledIcon icon='filter-qty--4' />)
    expect(wrapper.find(Button).props().iconLeft).not.toBeNull()
    expect(wrapper.find(Button).props().minWidthPx).toEqual('236px')
  })
})
