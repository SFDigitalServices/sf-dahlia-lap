import { mapList, mapShape } from '../utils'
import { mapOpenHouse } from './open_house'
import { mapUnit } from './unit'
import { mapListingLotteryPreference } from './listing_lottery_preference'
import { mapUser } from './user'
import { mapAccount } from './account'
import { mapBuilding } from './building'

export const mapListing = (l) => {
  return {
    owner: mapShape(mapUser, l.Owner),
    account: mapShape(mapAccount, l.Account),
    open_houses: mapList(mapOpenHouse, l.Open_Houses),
    listing_lottery_preferences: mapList(mapListingLotteryPreference, l.Listing_Lottery_Preferences),
    units: mapList(mapUnit, l.Units),
    building: mapShape(mapBuilding, l.Building),
    id:l.Id,
    owner_id: l.OwnerId,
    application_due_date: l.Application_Due_Date,
    name: l.Name,
    status: l.Status,
    min_br: l.Min_BR,
    lotterry_winners: l.Lottery_Winners,
    max_br: l.Max_BR,
    lottery_results: l.Lottery_Results,
    min_income: l.Min_Income,
    max_income: l.Max_Income,
    min_occupancy: l.Min_Occupancy,
    max_occupancy: l.Max_Occupancy,
    building_name: l.Building_Name,
    neighborhood: l.Neighborhood,
    building_street_address: l.Building_Street_Address,
    developer: l.Developer,
    building_city: l.Building_City,
    building_url: l.Building_URL,
    building_state: l.Building_State,
    year_built: l.Year_Built,
    building_zip_code: l.Building_Zip_Code,
    description: l.Description,
    lottery_prefrences: l.Lottery_Preferences,
    acessibility: l.Accessibility,
    fee: l.Fee,
    amenities: l.Amenities,
    deposit_min: l.Deposit_Min,
    costs_not_included: l.Costs_Not_Included,
    deposit_max: l.Deposit_Max,
    lottery_date: l.Lottery_Date,
    lottery_results_date: l.Lottery_Results_Date,
    lottery_venue: l.Lottery_Venue,
    lottery_summary: l.Lottery_Summary,
    lottery_street_address: l.Lottery_Street_Address,
    lottery_city: l.Lottery_City,
    lottery_url: l.Lottery_URL,
    reserved_community_type: l.Reserved_community_type,
    application_phone: l.Application_Phone,
    application_organization: l.Application_Organization,
    application_street_address: l.Application_Street_Address,
    application_city: l.Application_City,
    download_url: l.Download_URL,
    application_state: l.Application_State,
    organization_url: l.Organization_URL,
    application_postal_code: l.Application_Postal_Code,
    in_lottery: l.In_Lottery,
    leasing_agent_name: l.Leasing_Agent_Name,
    Leasing_Agent_title: l.Leasing_Agent_Title,
    leasing_agent_email: l.Leasing_Agent_Email,
    leasing_agent_phone: l.Leasing_Agent_Phone,
    legal_disclaimers: l.Legal_Disclaimers,
    building_selection_criteria: l.Building_Selection_Criteria,
    pet_policy: l.Pet_Policy,
    required_documents: l.Required_Documents,
    smoking_policy: l.Smoking_Policy,
    eviction_history: l.Eviction_History,
    criminal_history: l.Criminal_History,
    credit_rating: l.Credit_Rating,
    lottery_status: l.Lottery_Status,
    office_hours: l.Office_Hours,
    information_sessions: l.Information_Sessions,
    nflagged_applications: l.nFlagged_Applications
  }
}
