import React from 'react'
import DoubleIconButton from '~/components/atoms/DoubleIconButton'

const ButtonWrapper = () => {
  return (
    <DoubleIconButton
      leftIcon='list-unordered'
      text='Clear Filters'
      rightIcon='filter-qty--2'
      tertiary
    />
  )
}

export default ButtonWrapper
