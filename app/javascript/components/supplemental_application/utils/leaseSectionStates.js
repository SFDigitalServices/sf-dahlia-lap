import { doesApplicationHaveLease } from 'components/supplemental_application/utils/supplementalApplicationUtils'

const LEASE_STATES = {
  SHOW_LEASE: 'SHOW_LEASE',
  NO_LEASE: 'NO_LEASE',
  EDIT_LEASE: 'EDIT_LEASE'
}

export const hasLease = (leaseSectionState) => leaseSectionState !== LEASE_STATES.NO_LEASE

export const getInitialLeaseState = (application) =>
  doesApplicationHaveLease(application) ? LEASE_STATES.SHOW_LEASE : LEASE_STATES.NO_LEASE

export default LEASE_STATES
