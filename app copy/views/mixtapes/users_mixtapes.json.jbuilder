json.mixtapes @mixtapes do |mixtape|
	json.id mixtape.id
	json.name mixtape.name
	json.average_rating mixtape.average_rating
	json.category mixtape.category
	json.author_id mixtape.author_id
	json.random mixtape.random
	json.user_id mixtape.user_id
	json.created_at mixtape.created_at

	json.mixtape mixtape.songs do |song|
		json.song_id song.id
		json.song_name song.name
		json.artist_name song.artist

	end

end






