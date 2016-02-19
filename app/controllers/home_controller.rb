class HomeController < ApplicationController
	before_action :authenticate_user!
  def index
  	@home = Song.all
    # Koala.config.api_version = 'v2.0'
  	# @graph = Koala::Facebook::API.new('CAAXvpyabtAsBANOAuGP4lHSs2S6ozOgYFb8yfSWIDoAYKKLVv4xty3V9sK32HDrkvXNxSXRt9uZBXGRZAMDjpZChajPCmZAtL0O1wttgy0YdIld5h1ILtJl9cdgCAmnBPi2WJOCgFA0sQiSXyRKtUSVklMCJxFTZCxyXeN37ZAisR2jmZApfMFQTYHo5t8shTwZAiqDt5sqZBItTZCISWyLqgt')



  end

  def play
    @station = params[:station]
    render "index"
  end  
end
