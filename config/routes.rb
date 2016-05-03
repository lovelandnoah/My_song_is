Rails.application.routes.draw do
  get 'static_pages/bio'
  get 'static_pages/faq'
  get 'static_pages/topsongs'
  get 'users/show'
  get 'home/index'

  get 'static_pages/topsongs/song_popular_mysongis', to: 'static_pages#popular_mysongis'

  # root 'users#show'
  root 'users#show'

  post 'home_play', to: 'home#play'

  resources :song
  resources :home
  resources :mixtapes

  mount Judge::Engine => '/judge'

  get 'users_edit', to: 'users#edit', via: [:patch]


  get 'username_edit', to: 'users#edit_username', via: [:patch]
  get 'pick_a_song', to: 'users#pick_a_song', via: [:patch]
  get 'confirm_picture', to: 'users#confirm_picture', via: [:patch]
  get 'accept_confirm_picture', to: 'users#accept_confirm_picture', via: [:patch]
  get 'finished', to: 'users#call_to_action', via: [:get]
  get 'accept_finished', to: 'users#accept_finished', via: [:get]

  devise_scope :user do
    get '/login', to: 'registrations#login', via: [:post]
    get 'user_exists/', to: 'registrations#user_exists?', via: [:get]
    get 'email_exists/', to: 'registrations#email_exists?', via: [:get]
    get 'new_email_exists/', to: 'registrations#new_email_exists?', via: [:get]
  end

  put 'users/bio', to: 'users#update_bio'

  get 'mixtapes_find_single_mixtape', to: 'mixtapes#find_single_mixtape'
  get 'mixtapes_users_mixtapes', to: 'mixtapes#users_mixtapes'
  get '/calculate_average_rating', to: 'mixtapes#calculate_average_rating'

  devise_for :users, :controllers => { users: 'users', registrations: 'registrations', :omniauth_callbacks => "omniauth_callbacks" }
  # devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  get ':id', to: 'users#show', as: 'show'
end
