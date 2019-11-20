# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::ShortFormController < ApiController
  before_action :authenticate_user!

  def submit
    logger.debug "application_api_params: #{application_api_params}"
    short_form_validator = ShortFormValidator.new(application_api_params)

    if short_form_validator.valid?
      application = custom_api_application_service.submit(application_api_params)
      logger.debug "application submit response: #{application}"
      updated_application = soql_application_service.application(application_api_params[:id])

      render json: { application: updated_application }
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
            :confirmedHouseholdAnnualIncome,
            :monthlyIncome,
            :HHTotalIncomeWithAssets,
            :householdAssets,
            :totalMonthlyRent,
            :agreeToTerms,
            :applicationSubmissionType,
            :applicationSubmittedDate,
            :status,
            :numberOfDependents,
            :numberOfSeniors,
            :numberOfMinors,
            :formMetadata,
            :hasSenior,
            :primaryApplicantContact,
            :processingStatus,
            :applicationLanguage,
            :isFirstTimeHomebuyer,
            :hasCompletedHomebuyerEducation,
            :hasLoanPreapproval,
            :lendingAgent,
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
              lwPreferenceProof
              preferenceName
              individualPreference
              optOut
              recordTypeDevName
              ifCombinedIndividualPreference
              shortformPreferenceID
              city
              state
              address
              zip
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

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end
end
