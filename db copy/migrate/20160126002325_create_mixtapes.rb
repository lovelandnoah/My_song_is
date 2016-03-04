class CreateMixtapes < ActiveRecord::Migration
  def change
    create_table :mixtapes do |t|
      t.string :name
      t.string :category
      t.integer :author_id
      t.boolean :random
      t.integer :user_id

      t.belongs_to :user, index: true

      t.timestamps null: false
    end
  end
end
