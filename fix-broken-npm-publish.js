// create a file (with vim macro magic) at temp.txt and then update
// the version number here to update the patch version and run.
const execSync = require("child_process").execSync;

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("temp.txt"),
});

lineReader.on("line", function(line) {
  execSync(
    `perl -pi -e 's/1.1.2/1.1.3/g' packages/${line.slice(10)}/package.json`
  );
});
