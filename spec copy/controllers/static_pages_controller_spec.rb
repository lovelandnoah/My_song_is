require 'rails_helper'

RSpec.describe StaticPagesController, type: :controller do

  describe "GET #bio" do
    it "returns http success" do
      get :bio
      expect(response).to have_http_status(:success)
    end
  end

end
