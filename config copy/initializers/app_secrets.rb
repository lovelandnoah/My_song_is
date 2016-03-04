if Rails.env.development? || Rails.env.test?
  begin
    config = YAML.load(File.read("#{Rails.root}/config/facebook.yml"))
    config.each {|key, value| ENV[key] = value}
  rescue
    raise 'facebook.yml is not found'
  end
end