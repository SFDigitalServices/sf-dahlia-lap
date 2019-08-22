module MappingHelper
  def self.map_unit(u)
    {
      id: u.Id,
      unit_type: u.Unit_Type,
      unit_number: u.Unit_Number,
      bmr_rent_monthly: u.BMR_Rent_Monthly,
      bmr_rental_minimum_monthly_income_needed: u.BMR_Rental_Minimum_Monthly_Income_Needed,
      status: u.Status,
      property_type: u.Property_Type,
      ami_chart_type: u.AMI_chart_type,
      ami_chart_year: u.AMI_chart_year,
      of_ami_for_pricing_unit: u.of_AMI_for_Pricing_Unit,
      reserved_type: u.Reserved_Type
    }
  end

  def self.map_lottery_preferences(p)
    {
      id: p.Id,
      total_submitted_apps: p.Total_Submitted_Apps,
      order: p.Order,
      description: p.Description,
      available_units: p.Available_Units,
      pdf_url: p.PDF_URL,
      lottery_preference: {
        id: p.Lottery_Preference.Id,
        name: p.Lottery_Preference.Name
      }
    }
  end
end