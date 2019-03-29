import axios from 'axios'

export class Request {
  async apiCall (method, path, data) {
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

  async get (path, data) {
    return this.apiCall('get', path, data)
  }

  async post (path, data) {
    return this.apiCall('post', path, data)
  }

  async destroy (path, data) {
    return this.apiCall('delete', path, data)
  }

  async put (path, data) {
    return this.apiCall('put', path, data)
  }
}

export let request = new Request()
