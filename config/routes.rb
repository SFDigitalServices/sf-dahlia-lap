# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'pages#home'

  resources :pattern_library, only: %w[index]

  # Devise routes
  devise_for :users, controllers: { omniauth_callbacks: 'callbacks' }
  as :user do
    root to: 'pages#home'
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
    resources :applications, as: 'application_lease_up', only: %w[show] do
      get 'supplemental', :to => 'applications/supplementals#show'
      #resources :supplementals, :path => '/supplemental', as: 'supplemental_application', module: 'applications', only: %w[index]
    end

    scope module: 'listings' do
        resources :lease_ups, :path => '/listings', only: %w[index] do
          resources :applications, :path => '', module: 'lease_ups', only: %w[index]
        end
    end
  end

  # API namespacing
  namespace :api do
    namespace :v1 do
      get 'ami' => 'ami#get'

      resources :supplementals, only: %w[show]

      resources :applications, only: %w[index update] do
        resources :leases, only: %w[create update destroy]
      end

      scope '/field-update-comments' do
        post 'create' => 'field_update_comments#create'
      end

      scope '/flagged-applications' do
        put 'update' => 'flagged_applications#update'
      end

      resources :lease_up_applications, path: 'lease-ups/applications', only: %w[index]
      resources :lease_up_listings, path: 'lease-ups/listings', only: %w[index show]

      resources :preferences, only: %w[update]

      resources :rental_assistances, path: '/rental-assistances', only: %w[index create update destroy]

      resources :short_form, path: '/short-form', only: %w[show]

      scope '/short-form' do
        match 'submit', to: 'short_form#submit', via: [:put, :post]
      end
    end
  end
end
