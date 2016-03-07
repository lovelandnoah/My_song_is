class UsersController < ApplicationController
	before_action :set_user, only: [:show, :edit, :update, :destroy]
	skip_before_filter :authenticate_user!, only: [:show, :edit]

	helper_method :resource_name, :resource, :devise_mapping

	def edit
		# id = current_user.id
		# @user = User.where(id: current_user.id)
		@user = current_user
		# @user = current_user.id
	end

	def edit_username
		@user = current_user
	end

  def update
		@user = current_user
    if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
      params[:user].delete(:password)
      params[:user].delete(:password_confirmation)
    end

    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    resource_updated = update_resource(resource, account_update_params)
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
		if current_user == nil && params[:id] == nil
				redirect_to new_user_session_path
				# @user = User.find_by_username(params[:id])
		else
			if @user = User.find_by_username(params[:id])
			else
				@user = current_user
			end
				binding.pry
				@mixtape = Mixtape.where(user_id: @user.id)
				@mixtape_id = @mixtape[0].id

				if @mixtape.any?
					if Song.where(mixtape_id: @mixtape[0].id)
			  		@songs = Song.where(mixtape_id: @mixtape[0].id)
			  	end
				end
			  url_prefix = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chld=H&chl='
			  profile_url = request.original_url
			  @qr = url_prefix + profile_url
		end
			if current_user == nil
				@offline = true
			else
				if /\.twimg/.match(current_user.picture)
		      @img = current_user.picture.gsub("_normal", "")
		    end
		    if /\.graph\.facebook\.com/.match(current_user.picture)
		      @img = current_user.picture + "?width=500&height=500"
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
		@user = current_user
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
			params.require(:user).permit(:username, :email, :current_password, :password)
		end

		def update_resource(resource, params)
	    resource.update_without_password(params)
    end
end