class AddPlayMethodToUsers < ActiveRecord::Migration
  def change
    add_column :users, :playMethod, :string
  end
end
