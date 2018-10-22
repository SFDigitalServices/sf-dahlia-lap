# frozen_string_literal: true

module FixturesHelper
  def fixture(file)
    JSON.parse(File.read(Rails.root.join('spec', 'fixtures', file)))
  end
end
