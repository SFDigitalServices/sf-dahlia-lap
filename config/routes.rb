# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'pages#home'

  resources :pattern_library, only: %w[index]

  # Devise routes
  devise_for :users, controllers: { omniauth_callbacks: 'callbacks' }
  as :user do
    root to: 'pages#home', as: nil
    delete '/users/sign_out' => 'overrides/sessions#destroy'
  end

  # Salesforce resources
  resources :listings, only: %w[index show] do
    resources :applications, only: %w[new index], module: 'listings'
  end

  resources :applications, only: %w[index show edit] do
    collection do
      resources :flagged, module: 'applications', only: %w[index show]
    end
  end

  scope '/lease-ups' do
    resources :applications, as: 'application_lease_up', only: %w[show]

    scope module: 'listings' do
      resources :lease_ups, path: '/listings', only: %w[index] do
        resources :applications, path: '', module: 'lease_ups', only: %w[index]
      end
    end
  end

  get '/listings/:id/lottery-results' => 'lottery_results_pdf_generator#index'

  # API namespacing
  namespace :api do
    namespace :v1 do
      get 'ami' => 'ami#get'

      scope '/supplementals' do
        get 'units' => 'supplementals#units'
      end

      resources :supplementals, only: %w[show]

      resources :listings, only: %w[update]

      resources :applications, only: %w[index update] do
        resources :leases, only: %w[index create update destroy]
        resources :field_update_comments, only: %w[index create]
      end

      resources :flagged_applications, path: 'flagged-applications', only: %w[index update]
      scope 'flagged-applications' do
        get 'record-set/:id' => 'flagged_applications#record_set'
      end

      resources :lease_up_applications, path: 'lease-ups/applications', only: %w[index]
      resources :lease_up_listings, path: 'lease-ups/listings', only: %w[index show]

      resources :preferences, only: %w[update]

      resources :rental_assistances, path: '/rental-assistances', only: %w[index create update destroy]

      resources :short_form, path: '/short-form', only: %w[show]

      resources :lottery_results, path: '/lottery-results', only: %w[index]

      scope '/short-form' do
        match 'submit', to: 'short_form#submit', via: %i[put post]
      end

      post 'invite-to-apply' => 'invite_to_apply#email'
    end
  end
end
