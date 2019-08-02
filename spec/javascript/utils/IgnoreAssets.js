const IgnoreImageAndCSSLoad = async (page) => {
  await page.setRequestInterception(true)

  page.on('request', (req) => {
    if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
      return req.abort()
    }
    return req.continue()
  })

  return page
}

export default IgnoreImageAndCSSLoad
