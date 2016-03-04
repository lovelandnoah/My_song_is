class CreateRatings < ActiveRecord::Migration
  def change
    create_table :ratings do |t|
      t.integer :score
      t.belongs_to :user, index: true
			t.belongs_to :mixtape, index: true

      t.timestamps null: false
    end
  end
end
