class AddOmniauthToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :provider, :string
    add_column :users, :uid, :string
    add_column :users, :salesforce_user_id, :string
    add_column :users, :salesforce_account_id, :string
    add_column :users, :oauth_token, :string
    add_column :users, :admin, :boolean, default: false
    add_index :users, %i[uid provider], unique: true
  end
end
