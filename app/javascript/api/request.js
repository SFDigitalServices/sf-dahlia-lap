import axios from 'axios'

export class Request {
  /**
   * TODO: Remove throwOnError param once all request calls are migrated
   * to throw.
   */
  async apiCall (method, path, data, throwOnError = false) {
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
      if (throwOnError) throw e
      return false
    }
  }

  async get (path, data, throwOnError = false) {
    return this.apiCall('get', path, data, throwOnError)
  }

  async post (path, data, throwOnError = false) {
    return this.apiCall('post', path, data, throwOnError)
  }

  async destroy (path, data, throwOnError = false) {
    return this.apiCall('delete', path, data, throwOnError)
  }

  async put (path, data, throwOnError = false) {
    return this.apiCall('put', path, data, throwOnError)
  }
}

export let request = new Request()
