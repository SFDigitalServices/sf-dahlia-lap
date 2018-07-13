export const mapAttachment = (value) => {
  return {
    id: value.Id,
    name: value.Name,
    related_application: value.Related_Application,
    related_application_preference: value.Related_Application_Preference
  }
}
