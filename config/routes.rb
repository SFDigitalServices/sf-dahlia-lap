Rails.application.routes.draw do
  root to: 'pages#home'

  # devise routes
  devise_for :users, controllers: { omniauth_callbacks: 'callbacks' }
  as :user do
    root to: 'pages#home'
    delete '/users/sign_out' => 'overrides/sessions#destroy'
  end

  # salesforce resources
  resources :listings, only: %w[index show] do
    resources :applications, only: %w[new index], module: 'listings'
    collection do
      resources :lease_ups, only: %w[index], module: 'listings' do
        resources :applications, module: 'lease_ups', only: %w[index]
      end
    end
  end

  resources :applications, only: %w[index show edit] do
    collection do
      resources :flagged, module: 'applications', only: %w[index show]
    end
    resources :supplementals, only: %w[index], module: 'applications'
  end
  resources :lease_ups, only: %w[index]

  resources :pattern_library, only: %w[index]

  ## --- API namespacing
  namespace :api do
    namespace :v1 do
      scope '/short-form' do
        put 'update' => 'short_form#update'
        post 'submit' => 'short_form#submit'
      end
      scope '/flagged-applications' do
        put 'update' => 'flagged_applications#update'
      end

      resources :applications
      scope '/field-update-comments' do
        post 'create' => 'field_update_comments#create'
      end
    end
  end
end
