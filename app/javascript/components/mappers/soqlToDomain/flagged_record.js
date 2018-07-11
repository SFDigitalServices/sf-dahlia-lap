import { mapShape } from '../utils'
import { mapListing } from './listing'

export const mapFlaggedRecord = (flaggedRecord) => {
  return {
    id: flaggedRecord.Id,
    listing: mapShape(mapListing, flaggedRecord.Listing),
    rule_name: flaggedRecord.Rule_Name,
    total_number_of_pending_review: flaggedRecord.Total_Number_of_Pending_Review,
    total_number_of_appealed: flaggedRecord.Total_Number_of_Appealed,
    total_number_of_duplicates: flaggedRecord.Total_Number_of_Duplicates
  }
}
