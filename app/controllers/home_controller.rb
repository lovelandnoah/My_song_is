class HomeController < ApplicationController
	before_action :authenticate_user!
  def index
  	@home = Song.all
    # Koala.config.api_version = 'v2.0'
  	# @graph = Koala::Facebook::API.new('CAAXvpyabtAsBANOAuGP4lHSs2S6ozOgYFb8yfSWIDoAYKKLVv4xty3V9sK32HDrkvXNxSXRt9uZBXGRZAMDjpZChajPCmZAtL0O1wttgy0YdIld5h1ILtJl9cdgCAmnBPi2WJOCgFA0sQiSXyRKtUSVklMCJxFTZCxyXeN37ZAisR2jmZApfMFQTYHo5t8shTwZAiqDt5sqZBItTZCISWyLqgt')


    # if /\.twimg/.match(current_user.picture)
    #   @img = current_user.picture.gsub("_normal", "")
    # end

    # if /\.graph\.facebook\.com/.match(current_user.picture)
      # @img = current_user.picture + "?width=500&height=500"
    # end


  end

  def show
    if /\.twimg/.match(current_user.picture)
      @img = current_user.picture.gsub("_normal", "")
    end

    if /\.graph\.facebook\.com/.match(current_user.picture)
      @img = current_user.picture + "?width=500&height=500"
    end
  end

  def play
    @station = params[:station]
    render "index"
  end  
end
