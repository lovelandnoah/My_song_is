class AddConfirmedPictureToUsers < ActiveRecord::Migration
  def change
    add_column :users, :confirmed_picture, :boolean
  end
end
