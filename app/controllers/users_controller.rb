class UsersController < ApplicationController
	before_action :set_user, only: [:show, :edit, :update, :destroy]
	before_filter :ensure_sign_complete, only: [:new, :create, :update, :destroy]
	skip_before_filter :authenticate_user!, only: [:show]
	def edit
		# binding.pry
		# id = current_user.id
		# @user = User.where(id: current_user.id)
		# binding.pry
		@user = current_user
		# @user = current_user.id
	end

	def update
		@user = current_user

	end



	def show

		# @img = nil

    # if /\.twimg/.match(current_user.picture)
    #   @img = current_user.picture.gsub("_normal", "")
    # end

    # if /\.graph\.facebook\.com/.match(current_user.picture)
    #   @img = current_user.picture + "?width=500&height=500"
    # end


		if current_user == nil && params[:id] == nil
			redirect_to new_user_session_path
			# @user = User.find_by_username(params[:id])
		else
			show_user
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
		# binding.pry
	end

	def update
		respond_to do |f|
			if @user.update(user_params)
				sign_in(@user == current_user ? @user : current_user, bypass: true)
				f.html { redirect_to @user, notice: 'Your profile was successfully updated.' }
				f.json { head :no_content }
			else
				f.html { render :edit }
				f.json { render json: @user.errors, status: :unprocessable_entity }
			end
		end
	end

	def finish_signup
		if request.patch? && params[:user]
			if @user.update(user_params)
				# @user.skip_reconfirmation!
				sign_in(@user, :bypass => true)
				redirect_to root_url, notice: 'Your profile was successfully updated'
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
		# binding.pry
		@user = User.find_by(id: params[:id])
		# @user = User.find_by(username: params[:username])
	end

	private

		def user_params
			accessible = [ :name, :email, :username ]
			accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
			params.require(:user).permit(accessible)
		end
end