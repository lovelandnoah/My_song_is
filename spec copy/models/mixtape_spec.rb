require 'rails_helper'

RSpec.describe Mixtape, type: :model do
  describe 'attributes' do
    it { should respond_to(:id) }
    it { should respond_to(:name) }
    it { should respond_to(:category) }
    it { should respond_to(:user_id) }
    it { should respond_to(:author_id) }
    it { should respond_to(:random) }
    it { should respond_to(:average_rating) }
    it { should have_many(:ratings) }
    it { should have_many(:songs) }
  end
end
