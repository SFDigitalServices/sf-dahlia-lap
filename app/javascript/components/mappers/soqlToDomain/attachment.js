export const mapAttachment = (value) => {
  return {
    id: value.Id,
    document_type: value.Document_Type,
    related_application: value.Related_Application,
    related_application_preference: value.Related_Application_Preference
  }
}
