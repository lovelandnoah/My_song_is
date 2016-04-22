class AddDemoToUsers < ActiveRecord::Migration
  def change
    add_column :users, :demo, :boolean
  end
end
