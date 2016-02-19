class StaticPagesController < ApplicationController
	skip_before_filter :authenticate_user!
  def bio
  end

  def index
  	@songs = Song.all
  end
end
