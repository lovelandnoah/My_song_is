class AddAverageRatingToMixtapes < ActiveRecord::Migration
  def change
    add_column :mixtapes, :average_rating, :float
  end
end
