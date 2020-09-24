import { each, startCase, isPlainObject, includes, last, replace } from 'lodash'
import utils from '~/utils/utils'

const cleanupWords = (value) => {
  each(
    [
      [' Or ', ' or '],
      [' Of ', ' of '],
      ['Proof', 'proof'],
      ['Who', 'who'],
      ['Ada', 'ADA'],
      [' To ', ' to '],
      ['Claimed', 'claimed']
    ],
    ([a, b]) => {
      value = replace(value, a, b)
    }
  )

  return value
}

export const getLabel = (field) => {
  let l = ''
  if (isPlainObject(field)) {
    l = utils.cleanField(field.label)
  } else {
    l = utils.cleanField(field)
  }
  if (includes(l, '.')) {
    l = last(l.split('.'))
  }
  l = utils.cleanField(l)

  return cleanupWords(startCase(l))
}

export const titleizeLabel = (label) => {
  return cleanupWords(startCase(label))
}
