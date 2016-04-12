class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  TEMP_EMAIL_PREFIX = "temporary@email"
  TEMP_EMAIL_REGEX = /\Atemporary@email/


  has_attached_file :image, styles: { :medium => "320x" }, url: "/system/:hash.:extension", hash_secret: "devgitpoint"
  # might have to add a path to store the pics they upload in the above line
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  # before_save :create_permalink

  has_one :mixtape, dependent: :destroy
  has_many :identities,  dependent: :destroy

  accepts_nested_attributes_for :mixtape

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :authentication_keys => {email: true, username: false}
         
  validates_uniqueness_of :username, unless: :skip_username_validation
  # validates_presence_of :username

  validates_format_of :email, :without => TEMP_EMAIL_REGEX, on: :update

  devise password_length: 4..72

  before_create :build_mixtape

  attr_accessor :skip_username_validation




  # attr_accessor :current_password

  def self.find_for_oauth(auth, signed_in_resource = nil)
    identity = Identity.find_for_oauth(auth)

    user = signed_in_resource ? signed_in_resource :identity.user

    if user.nil?
      email_is_verified = auth.info.email && (auth.info.verified || auth.info.verified_email)
      email = auth.info.email if email_is_verified
      user = User.where(:email => email).first if email

      if user.nil?
        user = User.new(
          name: auth.extra.raw_info.name,
          picture: auth.info.image,
          username: auth.info.nickname || auth.uid,
          email: email ? email : "#{TEMP_EMAIL_PREFIX}-#{auth.uid}-#{auth.provider}.com",
          password: Devise.friendly_token[0,20],
          # username: auth.extra.raw_info.username
        )
        # user.skip_confirmation! #if user.respond_to?(:skip_confirmation)
        user.save!
      end
    end

    # associate identity with user if needed
    if identity.user != user
      identity.user = user
      identity.save!
    end
    user
  end

  def edit
  end

  def email_verified?
    self.email && self.email !~ TEMP_EMAIL_REGEX
  end

  # vanity URL
  # def to_param
  #   username
  # end

  # def self.from_omniauth(auth)
  #  where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
  #    user.email = auth.info.email
  #    user.password = Devise.friendly_token[0,20]
  #  end
  # end
  # vanity URL
  private

  def build_mixtape
    mixtape = Mixtape.create()
    mixtape.user_id = mixtape.id
    mixtape.save
  end
    # vanity URL
    # def create_permalink
    #   self.permalink = username.downcase
    # end

end
