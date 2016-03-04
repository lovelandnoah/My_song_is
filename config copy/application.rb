require File.expand_path('../boot', __FILE__)

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MySongIs
  class Application < Rails::Application
    @graph = Koala::Facebook::API.new('CAACEdEose0cBAJKmPJ7T80509BY0RUT8RMZABHu4to3hzU2rvtZBNaaVD5HVYYuxnKZClSaWIZCPN5k0bZCL55M5QH4WjKC4zk8JLK3fnOBlIVbr7tnw30CGdsn5WU74QNSxMVQZAAUdQyhPG0JmO81OHCpu4oP3kELE2NsNjO3v2iSzoM2O7wE9ogMoeJATduDZBauVPcdgbExGbdrIu6h')

    Koala.config.api_version = 'v2.0'
#     config.action_dispatch.default_headers = {
#     'X-Frame-Options' => 'ALLOWALL'
# }
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true
  end
end
