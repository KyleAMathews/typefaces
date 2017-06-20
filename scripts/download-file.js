var fs = require("fs")
var request = require("request")

module.exports = function(url, dest, cb) {
  var file = fs.createWriteStream(dest)
  var sendReq = request.get(url)

  // verify response code
  sendReq.on("response", function(response) {
    if (response.statusCode !== 200) {
      console.log("response from", url, response.statusCode)
      // return cb("Response status was " + response.statusCode)
    }
  })

  // check for request errors
  sendReq.on("error", function(err) {
    fs.unlink(dest)

    if (cb) {
      console.log("request error", err.message)
      return cb(err.message)
    }
  })

  sendReq.pipe(file)

  file.on("finish", function() {
    file.close(cb) // close() is async, call cb after close completes.
  })

  file.on("error", function(err) {
    // Handle errors
    fs.unlink(dest)

    // Delete the file async. (But we don't check the result)
    if (cb) {
      return cb(err.message)
    }
  })
}
