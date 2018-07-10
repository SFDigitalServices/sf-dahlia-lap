export const mapUnit = (unit) => {
  return {
    unit_type: unit.Unit_Type,
    bmr_rent_monthly: unit.BMR_Rent_Monthly,
    bmr_rental_minimum_monthly_income_needed: unit.BMR_Rental_Minimum_Monthly_Income_Needed,
    status: unit.Status,
    property_type: unit.Property_Type,
    ami_chart_type: unit.AMI_chart_type,
    ami_chart_year: unit.AMI_chart_year,
    of_ami_for_pricing_unit: unit.of_AMI_for_Pricing_Unit,
    reserved_type: unit.Reserved_Type,
  }
}
