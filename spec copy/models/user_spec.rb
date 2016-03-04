require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'attributes' do
    it { should respond_to(:email) }
    it { should have_many(:mixtapes).through(:ratings) }
    # it { should have_many(:songs) }
    it { should have_many(:ratings) }
  end

end
