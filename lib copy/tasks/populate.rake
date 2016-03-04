namespace :populate do
  desc "Deletes all mixtapes and populates database with new ones"
  task mixtapes: :environment do

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
	  		mixtape.average_rating = Faker::Number.between(1, 5)
	  		mixtape.random = false

	  		Song.populate(1) do |song|
					song.name = "What Do You Mean?"
					song.artist = "Justin Bieber"
					song.album = ""
					song.favorite = false
					song.mixtape_id = mixtape.id
  			end

  			Song.populate(1) do |song|
					song.name = "Love Yourself"
					song.artist = "Justin Bieber"
					song.album = ""
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
