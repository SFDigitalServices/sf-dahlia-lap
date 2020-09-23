export const isLeaseAlreadyCreated = (lease) => lease && !!lease.id

export const doesApplicationHaveLease = (application) => isLeaseAlreadyCreated(application?.lease)
