class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :artist
      t.string :album
      t.boolean :favorite
      t.string :genre
      t.integer :mixtape_id

      t.timestamps null: false
    end
  end
end
