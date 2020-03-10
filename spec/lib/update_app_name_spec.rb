# frozen_string_literal: true

require 'update_app_name'
require 'rails_helper'

RSpec.describe UdpateAppName do
  describe '#call' do
    subject { UdpateAppName.call }
    before :each do
      allow(PlatformAPI).to receive(:connect_oauth).and_return(client)
      allow(client).to receive(:app).and_return(app)
      allow(app).to receive(:list).and_return(list)
      allow(client).to receive(:review_app).and_return(review_app)
    end

    let(:app_double) { double('list', list: list) }
    let(:client) { instance_double(PlatformAPI::Client) }
    let(:app) { instance_double(PlatformAPI::App) }
    let(:review_app) { instance_double(PlatformAPI::ReviewApp) }

    context 'all apps are named correctly' do
      let(:list) do
        [
          { 'name': 'dahlia-lap-full-pr-1' },
          { 'name': 'other-application' },
        ].as_json
      end

      it 'should ignore non lap apps' do
        expect(app).not_to receive(:update)
        subject
      end
    end

    context 'app contails pr_number' do
      let(:list) do
        [
          { 'name': 'dahlia-lap-full-pr-1' },
          { 'name': 'dahlia-lap-some-name' },
        ].as_json
      end

      let(:review_app) do
        double('app', get_review_app_by_app_id:
          {
            'app': { 'id': '1234' },
            'pr_number': 2,
          }.as_json)
      end

      it 'should set app name with pr number' do
        expect(app).to receive(:update).with('1234', name: 'dahlia-lap-full-pr-2')
        subject
      end
    end

    context 'app is missing pr_number' do
      let(:list) do
        [
          { 'name': 'dahlia-lap-full-pr-1' },
          { 'name': 'dahlia-lap-full-failback-1' },
          { 'name': 'dahlia-lap-some-name' },
        ].as_json
      end

      let(:review_app) do
        double('app', get_review_app_by_app_id:
          {
            'app': { 'id': '1234' },
            'pr_number': nil,
          }.as_json)
      end

      it 'should update app with failback name' do
        expect(app).to receive(:update).with('1234', name: 'dahlia-lap-full-failback-2')
        subject
      end
    end
  end
end
