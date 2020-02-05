export const mapUnit = (unit) => {
  return {
    id: unit.Id,
    unit_type: unit.Unit_Type,
    unit_number: unit.Unit_Number,
    bmr_rent_monthly: unit.BMR_Rent_Monthly,
    bmr_rental_minimum_monthly_income_needed: unit.BMR_Rental_Minimum_Monthly_Income_Needed,
    status: unit.Status,
    property_type: unit.Property_Type,
    ami_chart_type: unit.AMI_chart_type,
    ami_chart_year: unit.AMI_chart_year,
    max_ami_for_qualifying_unit: unit.Max_AMI_for_Qualifying_Unit,
    reserved_type: unit.Reserved_Type
  }
}
