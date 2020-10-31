import React from 'react'
import Button from '~/components/atoms/Button'
import StyledIcon from '~/components/atoms/StyledIcon'

const createButton = (
  label,
  {
    tertiary = false,
    tightPadding = false,
    text = 'Clear Filters',
    showLeftIcon = false,
    showRightIcon = false,
    heightPx = undefined,
    widthPx = undefined
  }
) => {
  return (
    <>
      <div>{label}</div>
      <div>
        <Button
          iconLeft={showLeftIcon && <StyledIcon icon={'list-unordered'} />}
          iconRight={showRightIcon && <StyledIcon icon={'list-unordered'} />}
          text={text}
          tightPadding={tightPadding}
          tertiary={tertiary}
          heightPx={heightPx}
          widthPx={widthPx}
        />
      </div>
    </>
  )
}

const buttonVariationSection = (
  sectionHeaderText,
  { showLeftIcon = false, showRightIcon = false, text = 'Clear Filters' }
) => {
  return (
    <>
      <h3>{sectionHeaderText}</h3>
      {createButton('Primary', { text, showLeftIcon, showRightIcon })}
      {createButton('tertiary', { text, showLeftIcon, showRightIcon, tertiary: true })}
      {createButton('tight padding', { text, showLeftIcon, showRightIcon, tightPadding: true })}
      {createButton('custom height and width', {
        text,
        showLeftIcon,
        showRightIcon,
        tightPadding: true,
        heightPx: '48px',

        widthPx: '300px'
      })}
    </>
  )
}

const ButtonWrapper = () => {
  return (
    <>
      {buttonVariationSection('With two icons', {
        showLeftIcon: true,
        showRightIcon: true
      })}
      {buttonVariationSection('With only a left icon', {
        showLeftIcon: true
      })}
      {buttonVariationSection('With only a right icon', {
        showRightIcon: true
      })}

      {buttonVariationSection('With no icons', {})}

      {buttonVariationSection('With no text', {
        showLeftIcon: true,
        text: ''
      })}
    </>
  )
}

export default ButtonWrapper
