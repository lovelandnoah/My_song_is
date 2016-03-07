class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_action :authenticate_user!

  protect_from_forgery with: :exception



  # this is hopefully to get usernames working
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_in) { |u| u.permit(:email, :password,:username) }
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:email, :password, :username) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:email, :password, :username) }
  end

  def ensure_signup_complete
  	return if action_name == "finish_signup"
  	if current_user && !current_user.email_verified?
  		redirect_to username_edit_path
  	end
  end

  # def after_sign_in_path_for(resource)
  #   request.env['omniauth.origin'] || stored_location_for(resource) || '/username_edit_path'
  # end
end
