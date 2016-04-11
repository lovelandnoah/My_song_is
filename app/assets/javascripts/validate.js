$().ready(function() {
  $("#register-form").validate({
    rules: {
      username: {
        required: true,
        remote: ""
      }
    }
  })
})