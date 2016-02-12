Rails.application.routes.draw do
  get 'static_pages/bio'
  get 'static_pages/faq'
  get 'static_pages/topsongs'
  get 'users/show'
  # root 'users#show'
  root 'home#index'

  post 'home_play', to: 'home#play'

  resources :song
  resources :home
  resources :mixtapes

  get 'mixtapes_find_single_mixtape', to: 'mixtapes#find_single_mixtape'
  get 'mixtapes_users_mixtapes', to: 'mixtapes#users_mixtapes'
  get '/calculate_average_rating', to: 'mixtapes#calculate_average_rating'

  devise_for :users, :controllers => { registrations: 'registrations', :omniauth_callbacks => "omniauth_callbacks" }
  # devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  get ':id', to: 'users#show', as: 'show'
end
