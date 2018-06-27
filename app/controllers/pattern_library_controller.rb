# Rails controller for the pattern library
class PatternLibraryController < ApplicationController
  def index
    @expandable_table = Hashie::Mash.load("#{Rails.root}/app/component_fixtures/expandable_table.yml")
    @expandable_table_columns = @expandable_table['columns']
    @expandable_table_rows = @expandable_table['rows']
  end
end
