class AddTwitterUserToUsers < ActiveRecord::Migration
  def change
    add_column :users, :twitter_user, :string
  end
end
