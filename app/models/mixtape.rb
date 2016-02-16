class Mixtape < ActiveRecord::Base
	has_many :songs
	has_one :user
end
