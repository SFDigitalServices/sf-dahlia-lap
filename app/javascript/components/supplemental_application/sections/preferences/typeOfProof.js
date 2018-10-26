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
              href={appPaths.toAttachmentDownload(fileBaseUrl, file.id)}
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
  let typeOfProof = preference.recordtype_developername === 'L_W' ? preference.lw_type_of_proof : preference.type_of_proof
  let proofFilesForPreference = filter(proofFiles, { related_application_preference: preference.id })

  let isRentBurdenedAWithFiles = preference.recordtype_developername === 'RB_AHP' && some(proofFilesForPreference)
  let isNotRentBurdenedWithFiles = preference.recordtype_developername !== 'RB_AHP' && some(proofFilesForPreference)
  let typeOfProofMatchesFileType = typeOfProof === proofFilesForPreference[0].document_type

  if (isRentBurdenedAWithFiles || (isNotRentBurdenedWithFiles && typeOfProofMatchesFileType)) {
    return <ProofFilesList proofFiles={proofFilesForPreference} fileBaseUrl={fileBaseUrl} />
  } else if (isNotRentBurdenedWithFiles && !typeOfProofMatchesFileType) {
    return <TypeOfProofWithoutFile type={typeOfProof} />
  }
}

export const getTypeOfProof = (preference, proofFiles, fileBaseUrl) => {
  if (overSome(isCOP, isDTHP)(preference.preference_name)) { return preference.certificate_number } else { return getAttachments(preference, proofFiles, fileBaseUrl) }
}
