class RegistrationsController < Devise::RegistrationsController

  def edit
    @user = current_user
    @username = @user.username
    if @username == nil
      @username = "Username"
    end
    @picture = @user.picture
    if @picture == nil
      @picture = "Picture"
    end
    @full_name = @user.full_name
    if @full_name == nil
      @full_name = "Full Name"
    end
  end

  def update
    @user = User.find(current_user.id)
    if params[:user][:full_name].blank? || params[:user][:full_name] == "Full Name"
      params[:user][:full_name] = nil
      params[:user].delete(:full_name)
    end
    if params[:user][:picture].blank? || params[:user][:picture] == "Profile Picture URL"
      params[:user][:picture] = nil
      params[:user].delete(:picture)
    end
    if params[:user][:password].blank? || params[:user][:password] == "New Password (4 characters minimum)"
      params[:user].delete(:password)
      params[:user].delete(:current_password)
      if @user.update_attributes(:username => params[:user][:username])
        set_flash_message :notice, :updated
        if params[:user][:full_name]
          @user.update_attributes(:full_name => params[:user][:full_name])
        end
        if params[:user][:picture]
          @user.update_attributes(:picture => params[:user][:picture])
        end
        # Sign in the user bypassing validation in case his password changed
        sign_in @user, :bypass => true
        redirect_to after_update_path_for(@user)
      else
        respond_with_navigational(resource) do
          redirect_to edit_user_registration_path
        end
      end
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
    params.require(:user).permit(:username, :email, :password)
  end

  def account_update_params
    params.require(:user).permit(:username, :email, :password, :current_password, :full_name)
  end

  def after_sign_up_path_for(resource)
    username_edit_path
  end



end
