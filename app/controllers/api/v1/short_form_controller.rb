# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::ShortFormController < ApiController
  before_action :authenticate_user!

  def submit
    logger.debug "application_api_params: #{application_api_params}"
    short_form_validator = ShortFormValidator.new(application_api_params)

    if short_form_validator.valid?
      submit_lease if application_api_params.key?(:lease)
      application = custom_api_application_service.submit(application_api_params)
      logger.debug "application submit response: #{application}"
      render json: { application: application }
    else
      render status: 422, json: { errors: short_form_validator.errors.full_messages }
    end
  end

  private

  def application_api_params
    params.require(:application)
          .permit(
            :id,
            :listingID,
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
            :primaryApplicantContact,
            :processingStatus,
            :applicationLanguage,
            lease: %i[
              id
              unit
              lease_status
              lease_start_date
              monthly_parking_rent
              preference_used
              no_preference_used
              total_monthly_rent_without_parking
              monthly_tenant_contribution
            ],
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
              postLotteryValidation
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

  def custom_api_application_service
    Force::CustomApi::ApplicationService.new(current_user)
  end

  def rest_lease_service
    Force::Rest::LeaseService.new(current_user)
  end

  def soql_lease_service
    Force::Soql::LeaseService.new(current_user)
  end

  def submit_lease
    lease_params = application_api_params[:lease]
    lease_params[:application_id] = application_api_params[:id]
    lease_params[:primary_applicant_contact] = application_api_params[:primaryApplicantContact]

    if lease_params[:id]
      # If the lease is already present, we update it
      response = rest_lease_service.update(lease_params)
    else
      # Before creating a lease, we must check if one already exists for the
      # given application. An application must only have one lease. Even if an
      # ID is not passed with the lease params from the supp app short form, a
      # lease may still exist. For example, if the user created rental assistances
      # from the supp app page, that will have created a blank lease before the
      # entire supp app form was saved.
      existing_lease = soql_lease_service.application_lease(application_api_params[:id])
      if existing_lease
        response = rest_lease_service.update(lease_params.merge(id: existing_lease[:Id]))
      else
        response = rest_lease_service.create(lease_params)
      end
    end

    logger.debug "lease submit response: #{response}"
  end
end
