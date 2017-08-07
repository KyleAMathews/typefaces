var fs = require("fs")
const Downloader = require("mt-files-downloader")
var request = require("request")

module.exports = function(url, dest, cb) {
  const downloader = new Downloader()
  const dl = downloader.download(url, dest).start()
  dl.on("error", function() {
    // Retry download after 5 seconds
    setTimeout(() => {
      const dl2 = downloader.download(url, dest).start()
      dl2.on("error", function() {
        console.log("ERROR2 - Download " + dest)
        cb(true)
      })
      dl2.on("end", () => {
        console.log("retried download worked")
        console.log(dest)
        cb()
      })
    }, 5000)
  })
  dl.on("end", function() {
    // console.log("EVENT - Download " + dest + " finished !")
    cb()
  })
}
