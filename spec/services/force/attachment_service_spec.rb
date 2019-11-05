# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::AttachmentService do
  # Application with old type of proof attachement (Attachment)
  OLD_APPLICATION_ID = 'a0o0P00000GZazOQAT'
  # Application with newer proof attachment (File)
  NEW_APPLICATION_ID = 'a0o1D0000013w7pQAA'
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::AttachmentService.new(user) }

  describe '#app_proof_files' do
    it 'should return Id for old attachment' do
      VCR.use_cassette('services/attachment/old') do
        attachments = subject.app_proof_files(OLD_APPLICATION_ID)

        expect(attachments.first[:id]).to be_truthy
        expect(attachments.first[:file_type]).to eq('Attachment')
      end
    end

    it 'should return Id for new attachment' do
      VCR.use_cassette('services/attachment/new') do
        attachments = subject.app_proof_files(NEW_APPLICATION_ID)

        expect(attachments.first[:id]).to be_truthy
        expect(attachments.first[:file_type]).to eq('File')
      end
    end
  end
end
