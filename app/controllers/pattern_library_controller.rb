# frozen_string_literal: true

# Rails controller for the pattern library
class PatternLibraryController < ApplicationController
  def index
    @expandable_table = Hashie::Mash.load("#{Rails.root}/app/component_fixtures/expandable_table.yml")
    @expandable_table_columns = @expandable_table['columns']
    @expandable_table_rows = @expandable_table['rows']

    # Lease-up sidebar
    @example_lease_status_history = [
      {
        timeStamp: 1598425200,
        status: 'Withdrawn',
        subStatus: 'Written withdrawal',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque bibendum condimentum lorem consectetur eleifend.'
      },
      {
        timeStamp: 1598338800,
        status: 'Processing'
      },
      {
        timeStamp: 1598252400,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      },
      {
        timeStamp: 1598166000,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      },
      {
        timeStamp: 1598079600,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      },
      {
        timeStamp: 1597993200,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      },
      {
        timeStamp: 1597906800,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      },
      {
        timeStamp: 1597820400,
        status: 'Approved',
        subStatus: 'Approval letter sent'
      }
    ]
  end
end
