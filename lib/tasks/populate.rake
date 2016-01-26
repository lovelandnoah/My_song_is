namespace :populate do
  desc "Deletes all mixtapes and populates database with new ones"
  task mixtapes: :environment do
  	# Ride Wit Me  Nelly Country Grammer  Angel Shaggy Hotshot :: Ignition R. Kelly Chocolate Factory
  	# User.destroy_all
  	
  	password = "password"

		User.populate(20) do |user|
		  user.name = Faker::Name.name
		  user.email = Faker::Internet.email
		  user.encrypted_password = User.new(:password => password).encrypted_password
		  user.sign_in_count = 1

		  Mixtape.populate(5) do |mixtape|
	  		mixtape.user_id = user.id
	  		mixtape.author_id = user.id
	  		mixtape.name = Faker::Name.name
	  		mixtape.random = false

	  		Song.populate(1) do |song|
					song.name = "Ride Wit Me"
					song.artist = "Nelly"
					song.album = "Country Grammer"
					song.favorite = false
					song.mixtape_id = mixtape.id
  			end

  			Song.populate(1) do |song|
					song.name = "Angel"
					song.artist = "Shaggy"
					song.album = "Hotshot"
					song.favorite = false
					song.mixtape_id = mixtape.id
  			end

	  		Rating.populate(1) do |rating|
		  			rating.score = Faker::Number.between(1, 5)
		  			rating.user_id = user.id
		  			rating.mixtape_id = mixtape.id
		  	end
  		
  		end
		  
		end
		puts "#{User.count} users and #{Mixtape.count} mixtapes successfully created"

  end

end
