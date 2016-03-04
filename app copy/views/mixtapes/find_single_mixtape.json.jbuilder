json.(@mixtape, :id, :name, :created_at, :category)
json.songs  @mixtape.songs do |song|
		json.song_id song.id
		json.song_name song.name
		json.artist_name song.artist

	end

	