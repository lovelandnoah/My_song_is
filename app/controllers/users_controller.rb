class UsersController < ApplicationController
	before_action :set_user, only: [:show, :edit, :update, :destroy]
	before_filter :ensure_sign_complete, only: [:new, :create, :update, :destroy]
	skip_before_filter :authenticate_user!, only: [:show, :edit]

	helper_method :resource_name, :resource, :devise_mapping

  respond_to :html, :json


	def edit

		# id = current_user.id
		# @user = User.where(id: current_user.id)
		# @user = current_user.id

	end

	def edit_username
    # current_user.update_attributes(user_params)
    # current_user.update_attributes(:username => params[:user][:username])
    # if params[:user][:name]
    #   current_user.update_attributes(:name => params[:user][:name])
    # end
    # if params[:user][:picture]
    #   current_user.update_attributes(:picture => params[:user][:picture])
    # end
    # if params[:user][:image]
    #   current_user.update_attributes(:image => params[:user][:image])
    # end

    @omni = logged_in_using_omniauth?

    @resource = current_user
    @user = current_user
    @username = @user.username

    if @username == nil
      @username = "Username"
    end
    @name = @user.name
    if @name == nil
      @name = "Full Name"
    end
    @email = @user.email
    if /temporary@email/.match(@email)
      @email = "Email"
    end
    if @email == nil
      @email = "Email"
    end
	end

  def pick_a_song

  end

  def confirm_picture
    @picture = current_user.picture
    if @picture == nil
      @picture = "Profile Picture URL"
    end
  end

  def accept_confirm_picture
    current_user.update_attributes(:confirmed_picture => true)
    redirect_to :controller => 'users', :action => 'show'
  end

  def accept_finished
    current_user.update_attributes(:cta => true)
    redirect_to :controller => 'users', :action => 'show'
  end

  def call_to_action
    @url = "mysongis.herokuapp.com/" + current_user.username
    @username = current_user.username
  end

  def update_bio
    if params[:user][:bio]
      current_user.update_attributes(:bio => params[:user][:bio])
    end
    respond_with resource
  end

  def update


    @user.twitter_user = current_user.username
    @user.update_attributes(twitter_user_params)
    # if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
    #   params[:user].delete(:password)
    #   params[:user].delete(:password_confirmation)
    # end

    # self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    # prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    resource_updated = update_resource(resource, user_params)

    if params[:user][:image]
      @user.update_attributes(:image => params[:user][:image])
    end
    yield resource if block_given?
    if resource_updated
      if is_flashing_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
          :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end
      sign_in resource_name, resource, bypass: true
      respond_with resource, location: root_path
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

	def show
    # todo: tell if logged in with twitter
    @omni = logged_in_using_omniauth?
    if current_user
      if Song.where(mixtape_id: current_user).length > 0
        current_user.demo = true
      end
      if !current_user.demo
        redirect_to pick_a_song_path and return
      end
      if !current_user.confirmed_picture
        redirect_to confirm_picture_path and return
      end
      if !current_user.cta
        redirect_to finished_path and return
      end
    end

    if params[:id] != nil
      @user = User.find_by_username(params[:id])
    end
		if current_user == nil && params[:id] == nil
			redirect_to new_user_session_path
		else
      # if @user = User.find_by_username(params[:id])
      if @user == nil
			 @user = current_user
      end

      if @user != nil
        @img = @user.image.url(:medium)

        if @img == "/images/missing.png"
          if @user.picture != nil
            @img = @user.picture
          end
        end

  			@mixtape = Mixtape.where(user_id: @user.id)
  			@mixtape_id = @user.id

  			if @mixtape.any?
  				if Song.where(mixtape_id: @user.id)
  		  		@songs = Song.where(mixtape_id: @mixtape[0].id)
  		  	end
  			end
  		  url_prefix = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chld=H&chl='
  		  profile_url = request.original_url
  		  @qr = url_prefix + profile_url
      end
  	end

		if current_user == nil
			@offline = true
		else
      if @img == ""
  			if /\.twimg/.match(current_user.picture)
  	      @img = current_user.picture.gsub("_normal", "")
  	    end
  	    if /\.graph\.facebook\.com/.match(current_user.picture)
  	      @img = current_user.picture + "?width=500&height=500"
  	    end
      end
	  end
  end

	def show_user
		if
			@user = User.find_by_username(params[:id])
		elsif
			@user = current_user
    end

		@mixtape = Mixtape.where(user_id: @user.id)

		if @mixtape.any?
    	@songs = Song.where(mixtape_id: @mixtape[0].id)
		end
    url_prefix = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chld=H&chl='
    profile_url = request.original_url
    @qr = url_prefix + profile_url
	end

	def finish_signup

    @omni = logged_in_using_omniauth?
    if @omni
      current_user.update_attributes(:twitter_user => current_user.username)
    end

    @user.mixtape_attributes = {id: @user.id}
		if request.patch? && params[:user]
			if @user.update(user_params)
				# @user.skip_reconfirmation!
				sign_in(@user, :bypass => true)
				redirect_to username_edit_path, notice: 'Your profile was successfully updated'
			else
				redirect_to root_url
				@show_errors = true
			end
		end
	end

	def destroy
		@user.destroy
		respond_to do |f|
			f.html { redirect_to root_url }
			f.json { head :no_content }
		end
	end

	def set_user
		@user = User.find_by(id: params[:id])
		# @user = User.find_by(username: params[:username])
	end

	private

	def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

	def user_params
		accessible = [ :name, :picture, :image, :username, :playMethod, :demo, :confirmed_picture, :twitter_user]
		params.require(:user).permit(accessible)
	end

	def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def logged_in_using_omniauth?
    session[:logged_in_using_omniauth].present?
  end
end
