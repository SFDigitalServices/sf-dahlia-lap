import React from 'react'
import { filter, isEmpty, overSome } from 'lodash'

import appPaths from '~/utils/appPaths'
import {
  isCOP,
  isDTHP
} from './utils'


const ProofFilesList = ({ proofFiles, fileBaseUrl }) => {
  return (
    <ul>
      {
        proofFiles.map(file => (
          <li key={file.id}>
            <a
              href={appPaths.toAttachmentDownload(fileBaseUrl, file.id)}
              className="block-link"
              target="_blank"
            >
              {file.document_type}
            </a>
          </li>
        ))
      }
    </ul>
  )
}

const getAttachments = (preference, proofFiles, fileBaseUrl) => {
  const selectedProofFiles = filter(proofFiles, { related_application_preference: preference.id })
  return (!isEmpty(selectedProofFiles) &&
          <ProofFilesList proofFiles={selectedProofFiles} fileBaseUrl={fileBaseUrl} />)
}

export const getTypeOfProof = (preference, proofFiles, fileBaseUrl) => {
  if (overSome(isCOP, isDTHP)(preference.preference_name))
    return preference.certificate_number
  else
    return getAttachments(preference, proofFiles, fileBaseUrl)
}
