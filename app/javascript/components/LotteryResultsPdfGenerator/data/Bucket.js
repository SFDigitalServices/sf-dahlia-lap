export class Bucket {
  constructor(id, requirements = [], children) {
    this.id = id
    this.requirements = requirements
    this.children = children

    if (!this.children && this.requirements[0] instanceof Bucket) {
      this.children = this.requirements
      this.requirements = []
    }

    this.children = this.children || []
    this.applicants = []
  }

  reset() {
    this.applicants = []

    for (const child of this.children) {
      child.reset()
    }
  }

  isAllowed(applicant) {
    if (!this.requirements.length) {
      return true
    }

    return this.requirements.some((req) => {
      if (typeof req === 'function') {
        return req(applicant)
      } else {
        return applicant.prefs[req]
      }
    })
  }

  addApplicant(applicant, path = []) {
    if (this.isAllowed(applicant)) {
      const currentPath = [...path, this.id]

      if (this.children.length) {
        for (const child of this.children) {
          child.addApplicant(applicant, currentPath)
        }
      } else {
        this.applicants.push([applicant, currentPath])
      }
    }
  }

  addApplicantOnce(applicant, path = []) {
    if (this.isAllowed(applicant)) {
      const currentPath = [...path, this.id]

      if (this.children.length) {
        for (const child of this.children) {
          if (child.addApplicantOnce(applicant, currentPath)) {
            return true
          }
        }
      } else {
        this.applicants.push([applicant, currentPath])

        return true
      }
    }

    return false
  }

  getApplicants() {
    if (this.children.length) {
      return this.children.map((child) => child.getApplicants()).flat()
    } else {
      return this.applicants
    }
  }

  getPath(applicant) {
    let path = ''

    if (this.isAllowed(applicant)) {
      if (this.children.length) {
        for (const child of this.children) {
          const childPath = child.getPath(applicant)

          if (childPath) {
            path = `${this.id}/${childPath}`

            break
          }
        }
      } else {
        path = this.id
      }
    }

    return path
  }
}
