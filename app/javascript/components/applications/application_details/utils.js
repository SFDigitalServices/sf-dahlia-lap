import { each , startCase, upperFirst, isPlainObject, includes, last, replace } from 'lodash'
import utils from '~/utils/utils'

const cleanupWords = (value) => {
  // hey, if you think this is ugly and want to kill the developer
  // it was done by Fe. You can come and get me, I live in Buenos Aires, right now.
  // I'll be waiting. I'm not making anote about refactoring because it's pretty ovbious.
  each([
    [' Or ', ' or '],
    [' Of ', ' of '],
    ['Proof', 'proof'],
    ['Who', 'who'],
    ['Ada', 'ADA'],
    [' To ', ' to '],
    ['Claimed', 'claimed'],
    ['Proof', 'proof'],
    ['Proof', 'proof'],
    ['Proof', 'proof'],
  ], ([a, b]) => {
    value = replace(value, a, b)
  })

  return value
}

export const getLabel = (field) => {
  let l = ""
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
