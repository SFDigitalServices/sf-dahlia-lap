// preferences

export const preferencesWithoutVeterans = [
    {
        preference_name: 'Certificate of Preference (COP)',
        post_lottery_validation: 'Confirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'COP',
        certificate_number: '12345',
        application_id: 'application_id_1',
        application_member_id: '1'
    },
    {
        preference_name: 'Displaced Tenant Housing Preference (DTHP)',
        post_lottery_validation: 'Unconfirmed',
        first_name: 'Jane',
        last_name: 'Doe',
        preference_record_type: 'DTHP',
        certificate_number: 'abcde',
        application_id: 'application_id_2'
    }
]

export const preferencesWithVeteransInvalid = [
    {
        preference_name: 'Veteran Neighborhood Resident Housing Preference (V-NRHP)',
        post_lottery_validation: 'Confirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'NRHP',
        application_id: 'application_id_1'
    },
    {
        preference_name: 'Neighborhood Resident Housing Preference (NRHP)',
        post_lottery_validation: 'Invalid',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'NRHP',
        application_id: 'application_id_1'
    }
]

export const preferencesWithVeteransUnconfirmed = [
    {
        preference_name: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
        post_lottery_validation: 'Confirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'DTHP',
        application_id: 'application_id_1'
    },
    {
        preference_name: 'Displaced Tenant Housing Preference (DTHP)',
        post_lottery_validation: 'Unconfirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'DTHP',
        application_id: 'application_id_1'
    }
]

export const preferencesWithVeteransConfirmed = [
    {
        preference_name: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
        post_lottery_validation: 'Confirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'DTHP',
        application_id: 'application_id_1'
    },
    {
        preference_name: 'Displaced Tenant Housing Preference (DTHP)',
        post_lottery_validation: 'Confirmed',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'DTHP',
        application_id: 'application_id_1'
    }
]

export const preferencesWithoutProofAndMemberId = [
    {
        preference_name: 'Certificate of Preference (COP)',
        post_lottery_validation: 'Invalid',
        first_name: 'John',
        last_name: 'Doe',
        preference_record_type: 'COP',
        application_id: 'application_id_1'
    }
]

// proofFiles

// fileBaseUrl

// applicationMembers

export const applicationMembers = [
    {
        'id': '1',
        'first_name': 'John',
        'last_name': 'Doe'
    }
]
