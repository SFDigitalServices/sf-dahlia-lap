const application = {
  'attributes': {
    'type': 'Application',
    'url': '/services/data/v26.0/sobjects/Application/a0o0x000000OcOzAAK'
  },
  'id': 'a0o0x000000OcOzAAK',
  'name': 'APP-00191270',
  'applicant': {
    'attributes': {
      'type': 'Application_Member',
      'url': '/services/data/v26.0/sobjects/Application_Member/a0n0x000000AbE6AAK'
    },
    'id': 'a0n0x000000AbE6AAK',
    'first_name': 'karen',
    'last_name': 'jones',
    'middle_name': 'elizabeth',
    'name': 'karen elizabeth jones',
    'date_of_birth': {
      'year': '1950',
      'month': '01',
      'day': '01',
    },
    'phone_type': 'Cell',
    'phone': '9548883321',
    'second_phone_type': null,
    'second_phone': null,
    'email': 'eee@eeee.com',
    'primary_language': null,
    'residence_address': '123 MAIN ST, SAN FRANCISCO, CA, 94105-1804',
    'street': '123 MAIN ST',
    'city': 'SAN FRANCISCO',
    'state': 'CA',
    'zip_code': '94105-1804',
    'mailing_address': '123 Mailing St, SF Mailing, CA, 94105-1804',
    'mailing_street': '123 Mailing St',
    'mailing_city': 'SF Mailing',
    'mailing_state': 'CA',
    'mailing_zip_code': '94105-1804',
    'ethnicity': 'Decline to state',
    'race': 'Decline to state',
    'gender': 'Decline to state',
    'gender_other': 'gender other',
    'sexual_orientation': 'Decline to state',
    'sexual_orientation_other': 'sexual orientation other'
  },
  'alternate_contact': {
    'attributes': {
      'type': 'Application_Member',
      'url': '/services/data/v26.0/sobjects/Application_member/a0n0x000000XzcIAAS'
    },
    'id': 'a0n0x000000XzcIAAS',
    'first_name': 'Federic',
    'middle_name': 'Daaaa',
    'last_name': 'dayan',
    'phone_type': 'Cell',
    'phone': '9954449943',
    'email': 'fede@eee.com',
    'agency_name': null,
    'alternate_contact_type': 'Friend',
    'alternate_contact_type_other': null,
    'mailing_address': '123 Alternate Mailing St, SF Mailing, CA, 94105-1804',
    'mailing_street': '123 Alternate Mailing St',
    'mailing_city': 'SF Mailing',
    'mailing_state': 'CA',
    'mailing_zip_code': '94105-1804'
  },
  'demographics': {
    'ethnicity': 'Decline to state',
    'race': 'Decline to state',
    'gender': 'Decline to state',
    'gender_other': 'gender other',
    'sexual_orientation': 'Decline to state',
    'sexual_orientation_other': 'sexual orientation other'
  },
  'listing': {
    'attributes': {
      'type': 'Listing',
      'url': '/services/data/v26.0/sobjects/Listing/a0W0x000000GhJUEA0'
    },
    'name': 'Test 5/30',
    'id': 'a0W0x000000GhJUEA0',
    'reserved_community_type': null
  },
  'status': 'Submitted',
  'total_household_size': 2,
  'application_submission_type': 'Electronic',
  'application_submitted_date': '2018-06-19',
  'createdBy': {
    'attributes': {
      'type': 'User',
      'url': '/services/data/v26.0/sobjects/User/0050P000007H5XsQAK'
    },
    'name': 'Prod Vertiba'
  },
  'annual_income': 110000,
  'monthly_income': null,
  'housing_voucher_or_subsidy': 'true',
  'referral_source': null,
  'application_language': 'English',
  'lottery_number_manual': null,
  'lottery_number': '00191270',
  'total_monthly_rent': null,
  'general_lottery': true,
  'general_lottery_rank': null,
  'answered_community_screening': null,
  'has_military_service': null,
  'has_developmental_disability': null,
  'has_ada_priorities_selected': 'Vision impairments;Mobility impairments;Hearing impairments',
  'terms_acknowledged': true,
  'preferences': [
    {
      'id': 'a0w0x0000014pvyAAA',
      'name': 'AP-0000612141',
      'preference_name': 'Alice Griffith Housing Development Resident',
      'person_who_claimed_name': null,
      'type_of_proof': null,
      'opt_out': null,
      'lottery_status': 'None',
      'preference_lottery_rank': null,
      'listing_preference_iD': 'a0l0P00001PsqDoQAJ',
      'receives_preference': null,
      'application_member': {
        attributes: {type: 'Application_member', url: '/services/data/v43.0/sobjects/Application_member/a0n1D000000z51OQAQ'},
        first_name: 'karen',
        last_name: 'jones',
        date_of_birth: {
          year: '1950',
          month: '01',
          day: '01',
        },
        id: 'a0n0x000000AbE6AAK'
      },
      'individual_preference': null,
      'certificate_number': null,
      'preference_order': 0,
      'city': null,
      'state': null,
      'zip_code': null,
      'street': null,
      'recordType': {
        'DeveloperName': 'AG'
      }
    }
  ],
  'proof_files': [
    { id: 'xxxx1', document_type: 'Namexxx1' },
    { id: 'xxxx2', document_type: 'Namexxx2'}
  ],
  'household_members': [
    {
      'id': 'a0n0x000000XzchAAC',
      'name': 'diego m maradona',
      'first_name': 'diego',
      'last_name': 'maradona',
      'middle_name': 'm',
      'relationship_to_applicant': 'Child',
      date_of_birth: {
        year: '1976',
        month: '06',
        day: '11',
      },
      'street': '9 de julio',
      'city': 'buenos aires',
      'state': 'fl',
      'zip_code': '33026',
      'residence_address': '9 de julio, buenos aires, fl, 33026'
    }
  ],
  'flagged_applications': [

  ]
}

export default application
