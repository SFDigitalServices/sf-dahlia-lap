import { createFieldMapper } from '~/utils/objectUtils'

export const demographicsFieldMapper = {
  ethnicity:'ethnicity',
  race:'race',
  gender:'gender',
  gender_other:'genderOther',
  sex_at_birth:'sexAtBirth',
  sexual_orientation:'sexualOrientation',
  sexual_orientation_other:'sexualOrientationOther'
}

export const mapPreference = createFieldMapper(demographicsFieldMapper)
