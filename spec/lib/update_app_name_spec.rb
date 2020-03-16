# frozen_string_literal: true

require 'update_app_name'
require 'rails_helper'

RSpec.describe UpdateAppName do
  describe '#call' do
    subject { UpdateAppName.call }
    before :each do
      allow(PlatformAPI).to receive(:connect_oauth).and_return(client)
      allow(client).to receive(:app).and_return(app)
      allow(app).to receive(:list).and_return(list)
      allow(client).to receive(:review_app).and_return(review_app)
      allow(review_app).to receive(:list).and_return(review_apps)
    end

    let(:client) { instance_double(PlatformAPI::Client) }
    let(:app) { instance_double(PlatformAPI::App) }
    let(:review_app) { instance_double(PlatformAPI::ReviewApp) }
    let(:review_apps) { [] }

    context 'all apps are named correctly' do
      let(:list) do
        [
          { 'name': 'dahlia-lap-full-pr-1', id: '1' },
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
          { 'name': 'dahlia-lap-full-pr-1', 'id': '1' },
          { 'name': 'dahlia-lap-some-name', 'id': '2' },
        ].as_json
      end

      let(:review_apps) do
        [
          { 'app': { 'id': '2' }, 'pr_number': 2 },
          { 'app': { 'id': '1' }, 'pr_number': 1 },
        ].as_json
      end

      it 'should set app name with pr number' do
        expect(app).to receive(:update).with('2', name: 'dahlia-lap-full-pr-2')
        subject
      end
    end

    context 'app is missing pr_number' do
      let(:list) do
        [
          { 'name': 'dahlia-lap-full-pr-1', 'id': '1' },
          { 'name': 'dahlia-lap-full-fallback-1', 'id': '2' },
          { 'name': 'dahlia-lap-some-name', 'id': '3' },
          { 'name': 'dahlia-lap-some-other-name', 'id': '4' },
        ].as_json
      end

      let(:review_apps) do
        [
          { 'app': { 'id': '1' }, 'pr_number': '1' },
          { 'app': { 'id': '2' }, 'pr_number': nil },
          { 'app': { 'id': '3' }, 'pr_number': nil },
          { 'app': { 'id': '4' }, 'pr_number': nil },
        ].as_json
      end

      it 'should update app with fallback name' do
        expect(app).to receive(:update).once.with('3', name: 'dahlia-lap-full-fallback-2')
        expect(app).to receive(:update).once.with('4', name: 'dahlia-lap-full-fallback-3')
        subject
      end
    end
  end
end
