import axios from 'axios'

const apiCall = async (method, path, data) => {
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

export const get = async (path, data) => {
  apiCall('get', path, data)
}

export const post = async (path, data) => {
  apiCall('post', path, data)
}

export const destroy = async (path, data) => {
  apiCall('delete', path, data)
}

export const put = async (path, data) => {
  apiCall('put', path, data)
}
