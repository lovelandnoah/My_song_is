json.(@mixtape, :id, :name, :category, :author_id, :random, :user_id)

json.@song @mixtape.songs do |song|
    json.song_id song.id
    json.song_name song.name
    json.artist_name artist_name
  end
json.url list_url(@mixtape)
