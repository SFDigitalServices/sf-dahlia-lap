# frozen_string_literal: true

# RSpec.shared_examples "s" do |parameter|
#   \# Same behavior is triggered also with either `def something; 'some value'; end`
#   \# or `define_method(:something) { 'some value' }`
#   let(:something) { parameter }
#   it "uses the given parameter" do
#     expect(something).to eq(parameter)
#   end
# end
