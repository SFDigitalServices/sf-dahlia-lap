export const mapListingLotteryPreference = (i) => {
  return {
    id: i.Id,
    total_submitted_apps: i.Total_Submitted_Apps,
    order: i.Order,
    description: i.Description,
    available_units: i.Available_Units,
    pdf_url: i.PDF_URL,
    lottery_preference: {
      id: i.Lottery_Preference.Id,
      name: i.Lottery_Preference.Name
    }
  }
}
