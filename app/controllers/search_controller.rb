class SearchController < ApplicationController
  def index
    artists = 
    render json: artists
    # @home = Song.all
  end
end
