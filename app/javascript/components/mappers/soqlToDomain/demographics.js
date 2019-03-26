export const mapDemographics = (value) => {
  return {
    ethnicity: value.Ethnicity,
    race: value.Race,
    gender: value.Gender,
    gender_other: value.Gender_Other,
    sexual_orientation: value.Sexual_Orientation,
    sexual_orientation_other: value.Sexual_Orientation_Other
  }
}
