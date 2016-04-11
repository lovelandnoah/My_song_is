class RegistrationsController < Devise::RegistrationsController

  def new
    build_resource({})
    set_minimum_password_length
    yield resource if block_given?
    respond_with self.resource
  end

  # POST /resource
  def create
    @user = build_resource(sign_up_params)
    @user.skip_username_validation = true
    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  def edit
    @user = current_user
    @username = @user.username
    @omni = logged_in_using_omniauth?
    @image = @user.image
    if @image == nil
      @image = "Image"
    end
    if @username == nil
      @username = "Username"
    end
    @picture = @user.picture
    if @picture == nil
      @picture = "Profile Picture URL"
    end
    @name = @user.name
    if @name == nil
      @name = "Full Name"
    end
    @email = @user.email
    if /temporary@email/.match(@email)
      @email = "Email"
    end
  end


  def update
    @user = User.find(current_user.id)
    if params[:user][:name].blank? || params[:user][:name] == "Full Name"
      params[:user][:name] = nil
      params[:user].delete(:name)
    end
    if params[:user][:picture].blank? || params[:user][:picture] == "Profile Picture URL"
      params[:user][:picture] = nil
      params[:user].delete(:picture)
    end
    if params[:user][:image].blank? || params[:user][:image] == "Profile image Upload"
      params[:user][:image] = nil
      params[:user].delete(:image)
    end
    if params[:user][:password].blank? || params[:user][:password] == "New Password (4 characters minimum)"
      params[:user].delete(:password)
      params[:user].delete(:current_password)
      if params[:user][:username]
        @user.update_attributes(:username => params[:user][:username])
      end
      if params[:user][:name]
        @user.update_attributes(:name => params[:user][:name])
      end
      if params[:user][:picture]
        @user.update_attributes(:picture => params[:user][:picture])
      end
      if params[:user][:image]
        @user.update_attributes(:image => params[:user][:image])
      end
      if params[:user][:email]
        @user.update_attributes(:email => params[:user][:email])
      end
      # Sign in the user bypassing validation in case his password changed
      sign_in @user, :bypass => true
      redirect_to after_update_path_for(@user)
      # else
      #   respond_with_navigational(resource) do
      #     if params[:commit] == "Finish Sign Up"
      #       redirect_to username_edit_path
      #     else
      #       redirect_to edit_user_registration_path
      #     end
      #   end
    else
      if @user.update_with_password(account_update_params)
      set_flash_message :notice, :updated
      # Sign in the user bypassing validation in case his password changed
      sign_in @user, :bypass => true
      redirect_to after_update_path_for(@user)
    else
      clean_up_passwords(resource)
      respond_with_navigational(resource) do
        render :username_edit_path
      end
      end
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password)
  end

  def account_update_params
    params.require(:user).permit(:username, :email, :password, :current_password, :name, :image)
  end

  def after_sign_up_path_for(resource)
    username_edit_path
  end

  def logged_in_using_omniauth?
    session[:logged_in_using_omniauth].present?
  end

end
