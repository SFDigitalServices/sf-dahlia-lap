import axios from 'axios'

const apiCall = async (method, path, data) => {
  console.log('calling the api call OK')
  if (process.env.NODE_ENV === 'test') {
    var err = Error('API should not be called in TEST')
    console.error(err)
    throw err
  }
  try {
    const request = await axios[method](`/api/v1${path}`, data)
    return request.data
  } catch (e) {
    console.warn(e)
    return false
  }
}

export default {
  apiCall
}
