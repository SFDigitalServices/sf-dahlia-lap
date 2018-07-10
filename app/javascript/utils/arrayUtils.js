import { take, takeRight } from 'lodash'

class Cycle {

  constructor(values) {
    this.values = values
    this.currentPosition = 0
  }

  setPosition(position) {
    this.currentPosition = position
  }

  next() {
    this.currentPosition++

    if (this.currentPosition >= this.values.length)
      this.currentPosition = 0

    return this.currentValue()
  }

  prev() {
    this.currentPosition--

    if (this.currentPosition < 0)
      this.currentPosition = this.values.length - 1

    return this.currentValue()
  }

  currentValue() {
    return this.values[this.currentPosition]
  }

  push(value) {
    this.values.push(value)
  }
}

const cycle = (value) => new Cycle(value)

const splitInHalf = (array) => {
  let halfLength = array.length / 2
  let firstHalf = take(array, Math.floor(halfLength))
  let secondHalf = takeRight(array, Math.ceil(halfLength))

  return { firstHalf, secondHalf }
}

export default {
  cycle,
  splitInHalf
}
