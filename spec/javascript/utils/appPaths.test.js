import appPaths from 'utils/appPaths'

describe('appPaths', () => {
  describe('toAttachmentDownload', () => {
    test('it should return attachment url if attachment', () => {
      const file = { 'file_type': 'Attachment', id: 'fileId' }
      const url = appPaths.toAttachmentDownload('fileBase.com', file)
      const expectedUrl = 'fileBase.com/servlet/servlet.FileDownload?file=fileId'
      expect(url).toEqual(expectedUrl)
    })
    test('it should return file url if file', () => {
      const file = { 'file_type': 'File', id: 'fileId' }
      const url = appPaths.toAttachmentDownload('fileBase.com', file)
      const expectedUrl = 'fileBase.com/sfc/servlet.shepherd/version/download/fileId'
      expect(url).toEqual(expectedUrl)
    })
    test('it should return null url not an expected file_type', () => {
      const file = { 'file_type': 'Something Else', id: 'fileId' }
      const url = appPaths.toAttachmentDownload('fileBase.com', file)
      expect(url).toBeNull()
    })
  })
})
