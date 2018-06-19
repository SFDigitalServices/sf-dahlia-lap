import { mapListing, mapLeaseUpApplication } from '~/components/mappers/soqlToDomain'

const mapProperties = ({ listing, applications }) => {
  return  {
    listing: mapListing(listing),
    applications: applications.map(mapLeaseUpApplication)
  }
}

export default mapProperties
