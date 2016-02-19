class SongController < ApplicationController
  def index
    @songs = Song.all
  end

  def popular_mysongis
    binding.pry
    @songs = Song.all

    # @songs.each do |s|
    # end

    # @songs.detect{ |e| @songs.count(e) > 1 }


    # h = Hash.new(0)
    # ['a','b','b','c'].each{ |e| h[e] += 1 }


    # @songs.pluck :name
    # words.each_with_object(Hash.new(0)) { |word,counts| counts[word] += 1 }
    # Hash[zz.sort_by{|k,v| -v}]
    # @newsort.first(10)
    
    # @songs.where(name: @yes.keys.last).first.artist
    # @songs.where(name: "Love Yourself").first.artist

    # @sortnames.keys.last
    # @super=@songs.as_json
  end

  def create

  	song_name = params[:name]
  	artist = params[:artist]
  	mixtape_id = params[:mixtape_id]
    @song = Song.new()
    @song.mixtape_id = mixtape_id
    @song.name = song_name
    @song.artist = artist

    @song.save
    #TODO: check if song is unique

    # if @song.save
    # 	#todo slidetoggle artist
    # end
    render json: @mixtape
  end

  def destroy
    Song.find(params[:id]).destroy
    head :ok
  end

  private

    # def song_params
    #   params.require(:song).permit(:name, :artist, :mixtape_id)
    # end
end
