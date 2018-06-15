import { mapListing, mapLeaseUpApplication } from '../propMappers'

const mapProperties = ({ listing, applications }) => {
  return  {
    listing: mapListing(listing),
    applications: applications.map(mapLeaseUpApplication)
  }
}

export default mapProperties
