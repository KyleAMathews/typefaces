const execSync = require("child_process").execSync;

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("temp"),
});

lineReader.on("line", function(line) {
  execSync(
    `perl -pi -e 's/0.0.69/0.0.70/g' packages/${line.slice(9)}/package.json`
  );
});
