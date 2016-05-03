# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'


Rails.application.config.assets.precompile += %w( jquery.validate.js )
Rails.application.config.assets.precompile += %w( jquery.validate.additional-methods.js )

Rails.application.config.assets.precompile += %w( registrations.css )
Rails.application.config.assets.precompile += %w( images.css )
Rails.application.config.assets.precompile += %w( rails.validations.js )
Rails.application.config.assets.precompile += %w( components.js )

Rails.application.config.assets.precompile += %w( validation-extentions.js )
