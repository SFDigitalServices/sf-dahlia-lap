import React from 'react'
import { filter, some, overSome } from 'lodash'

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
              href={appPaths.toAttachmentDownload(fileBaseUrl, file)}
              className='block-link'
              target='_blank'
            >
              {file.document_type}
            </a>
          </li>
        ))
      }
    </ul>
  )
}

const TypeOfProofWithoutFile = ({type}) => {
  return (
    <ul>
      <li>
        {type}
      </li>
    </ul>
  )
}

const getAttachments = (preference, proofFiles, fileBaseUrl) => {
  let proofFilesForPreference = filter(proofFiles, { related_application_preference: preference.id })
  let typeOfProof = preference.recordtype_developername === 'L_W' ? preference.lw_type_of_proof : preference.type_of_proof
  let typeOfProofMatchesFileType = some(proofFilesForPreference) && typeOfProof === proofFilesForPreference[0].document_type
  let isRentBurdened = preference.recordtype_developername === 'RB_AHP'

  if (typeOfProof && !typeOfProofMatchesFileType && !isRentBurdened) {
    return <TypeOfProofWithoutFile type={typeOfProof} />
  } else {
    return <ProofFilesList proofFiles={proofFilesForPreference} fileBaseUrl={fileBaseUrl} />
  }
}

export const getTypeOfProof = (preference, proofFiles, fileBaseUrl) => {
  if (overSome(isCOP, isDTHP)(preference.preference_name)) { return preference.certificate_number } else { return getAttachments(preference, proofFiles, fileBaseUrl) }
}
