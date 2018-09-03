const count = async (page, selector) => {
  return page.$$eval(selector, elements => elements.length)
}

const isPresent = async (page, selector) => {
  const c = await count(page, selector)
  return c > 0
}

export default {
  count,
  isPresent
}
