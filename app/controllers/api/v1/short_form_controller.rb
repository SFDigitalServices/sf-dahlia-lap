# Controller for the short form API.
class Api::V1::ShortFormController < ApiController
  before_action :authenticate_user!

  def submit
    logger.debug "application_api_params: #{application_api_params}"
    short_form_validator = ShortFormValidator.new(application_api_params)
    if short_form_validator.valid?
      application = application_service.submit(application_api_params)
      logger.debug "application submit response: #{application}"
      render json: { application: application }
    else
      render status: 422, json: { errors: short_form_validator.errors.full_messages }
    end
  end

  def update
    result = application_service.update(application_db_params)
    render json: { result: result }
  end

  private

  def application_api_params
    params.require(:application)
          .permit(
            :id,
            :listingID,
            :applicationLanguage,
            :answeredCommunityScreening,
            :adaPrioritiesSelected,
            :householdVouchersSubsidies,
            :referral,
            :hasPublicHousing,
            :hasMilitaryService,
            :hasDevelopmentalDisability,
            :annualIncome,
            :monthlyIncome,
            :HHTotalIncomeWithAssets,
            :householdAssets,
            :totalMonthlyRent,
            :agreeToTerms,
            :applicationSubmissionType,
            :applicationSubmittedDate,
            :status,
            :numberOfDependents,
            :formMetadata,
            :hasSenior,
            primaryApplicant: %i[
              contactId
              appMemberId
              language
              phone
              firstName
              lastName
              middleName
              noPhone
              phoneType
              additionalPhone
              alternatePhone
              alternatePhoneType
              email
              noEmail
              noAddress
              hasAltMailingAddress
              workInSf
              languageOther
              gender
              genderOther
              ethnicity
              race
              sexAtBirth
              sexualOrientation
              sexualOrientationOther
              hiv
              DOB
              address
              city
              state
              zip
              mailingAddress
              mailingCity
              mailingState
              mailingZip
              preferenceAddressMatch
              xCoordinate
              yCoordinate
              whichComponentOfLocatorWasUsed
              candidateScore
              maritalStatus
            ],
            alternateContact: %i[
              appMemberId
              alternateContactType
              alternateContactTypeOther
              firstName
              middleName
              lastName
              agency
              phone
              phoneType
              email
              languageOther
              mailingAddress
              mailingCity
              mailingState
              mailingZip
            ],
            householdMembers: %i[
              appMemberId
              firstName
              lastName
              middleName
              hasSameAddressAsApplicant
              noAddress
              workInSf
              relationship
              DOB
              address
              city
              state
              zip
              preferenceAddressMatch
              xCoordinate
              yCoordinate
              whichComponentOfLocatorWasUsed
              candidateScore
            ],
            shortFormPreferences: %i[
              applicationId
              listingPreferenceID
              appMemberID
              certificateNumber
              naturalKey
              preferenceProof
              preferenceName
              individualPreference
              optOut
              recordTypeDevName
              ifCombinedIndividualPreference
              shortformPreferenceID
              city
              state
              address
              zipCode
            ],
          )
  end

  def application_db_params
    params.require(:application)
          .permit(
            :Id,
            :Application_Submission_Type__c,
          )
  end

  def application_service
    Force::ApplicationService.new(current_user)
  end
end
