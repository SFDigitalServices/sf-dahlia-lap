const keyCodeMapping = {
  'leftArrow': 37,
  'rightArrow': 39,
  'tab': 39
}

const isKeyword = (keyCode, code) => {
  const keyCodeMapped = keyCodeMapping[code]

  if (keyCode == null)
    throw `Keyboard code mapping '${code}' not found.`

  return keyCode == keyCodeMapped
}

const isKeywordEvent = (e, code) => isKeyword(e.keyCode, code)

class KeyboardEvents {
  constructor(event) {
    this.event = event
  }

  on(eventName, callback) {
    if (isKeywordEvent(this.event, eventName))
      callback(this.event)

    return this
  }
}

const forEvent = (event) => new KeyboardEvents(event)

export default {
  forEvent,
  isKeyword,
  isKeywordEvent,
  keyCodeMapping
}
