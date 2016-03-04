require 'rails_helper'

RSpec.describe MixtapesController, type: :controller do
  let (:user){FactoryGirl.create(:user)}
  before(:each) do
    sign_in user
  end

  describe "DELETE #destroy" do
    it "deletes a mixtape successfully" do
      user = FactoryGirl.create(:user)
      mixtape = FactoryGirl.create(:mixtape, user_id: user.id)
      expect(Mixtape.count).to eq(1)
      # binding.pry   it has a user id of 1, and it works in our app.
      delete :destroy, id: mixtape.id
      expect(Mixtape.count).to eq(0)
    end
  end

  describe "POST #create" do
    it "will create a mixtape successfully" do
      mixtape_params = {mixtape: {name: 'HotFire', category: 'Category', user_id: 1, author_id: 1} }
      expect(Mixtape.count).to eq(0)
      post :create, mixtape_params
      expect(Mixtape.count).to eq(1)
    end

  end

end
