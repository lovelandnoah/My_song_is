class AddCtaToUsers < ActiveRecord::Migration
  def change
    add_column :users, :cta, :boolean
  end
end
