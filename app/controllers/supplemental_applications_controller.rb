class SupplementalApplicationsController < ApplicationController
  def index
    @application = {
      application_id: 'APP-00-125972',
      applicant_name: 'JIM DOVER',
      listing_id: 'a0W0x0000005q5MEAQ'
    }
  end
end
