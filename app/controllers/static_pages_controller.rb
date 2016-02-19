class StaticPagesController < ApplicationController
	skip_before_filter :authenticate_user!
  def bio
  end

  def index
  	@songs = Song.all
  end


  def popular_mysongis
    @songs = Song.all

    # @songs.each do |s|
    # end

    # @songs.detect{ |e| @songs.count(e) > 1 }


    # h = Hash.new(0)
    # ['a','b','b','c'].each{ |e| h[e] += 1 }


    @names = @songs.pluck :name
    @songhash = @names.each_with_object(Hash.new(0)) { |word,counts| counts[word] += 1 }
    @organizedsong = Hash[@songhash.sort_by{|k,v| -v}]
    # @topsongarray = @organizedsong.first(10)
    @keys = @organizedsong.keys
    @top10 = @keys.first(10)


    @tophash = Struct.new(:name, :artist)
		
		@forecasts = []
		@top10.each do |s|
			@forecasts << [@tophash.new(s, @songs.where(name: s).first.artist)]
		end
		
		# @forecasts.flatten.first.name
		@flattened = @forecasts.flatten

		binding.pry
		# Hash[@forecasts.map{|@tophash| [@tophash.name, @tophash.artist]}]
		# => {"mary"=>2, "bob"=>1}    

    # @songs.where(name: @yes.keys.last).first.artist
    # @songs.where(name: "Love Yourself").first.artist

    # @sortnames.keys.last
    # @super=@songs.as_json
  end
end
