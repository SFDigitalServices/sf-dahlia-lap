Rails.application.routes.draw do
  root to: 'pages#home'

  # devise routes
  devise_for :users, controllers: { omniauth_callbacks: 'callbacks' }
  as :user do
    root to: 'pages#home'
    delete '/users/sign_out' => 'devise/sessions#destroy'
  end

  # salesforce resources
  resources :listings, only: %w[index show] do
    resources :applications, only: %w[new] do
      collection do
        get '/' => 'applications#listing_index'
      end
    end
  end
  resources :applications, only: %w[index show edit] do
    collection do
      get 'spreadsheet'
    end
  end

  scope '/flagged_record_sets' do
    get ':id/flagged_applications' => 'flagged_record_sets#flagged_applications', as: :flagged_applications
    get 'pending_review_index' => 'flagged_record_sets#pending_review_index'
    get 'marked_duplicate_index' => 'flagged_record_sets#marked_duplicate_index'
  end

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
    end
  end
end
