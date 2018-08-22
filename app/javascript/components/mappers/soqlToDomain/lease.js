export const mapLease = (lease) => {
  return {
    id: lease.Id,
    unit: lease.Unit,
    lease_start_date: lease.Lease_Start_Date,
    monthly_parking_rent: lease.Monthly_Parking_Rent,
    total_monthly_rent_without_parking: lease.Total_Monthly_Rent_without_Parking,
    monthly_tenant_contribution: lease.Monthly_Tenant_Contribution,
  }
}
