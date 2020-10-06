const fs = require(`fs-extra`);
const { readme } = require(`./templates`);

// Read every package & get the id & name from its package.json
const packages = fs
  .readdirSync(`./packages`, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);
const packagesCount = packages.length;

const filteredPackages = packages.filter((p) => p > "noticia-text");
console.log(filteredPackages);

filteredPackages.forEach((p) => {
  const typefaceId = p;
  const typefaceDir = `packages/${typefaceId}`;

  let package;
  try {
    package = JSON.parse(fs.readFileSync(`./${typefaceDir}/package.json`));
  } catch (e) {
    console.log(e);
    return;
  }
  // console.log(package);

  const typefaceName = package.description.split(` `).slice(0, -1).join(` `);

  // console.log({ typefaceDir, typefaceId, typefaceName, packagesCount });

  // Write out the README.md
  const packageReadme = readme({
    typefaceId,
    typefaceName,
    count: packagesCount,
  });

  fs.writeFileSync(`${typefaceDir}/README.md`, packageReadme);
});
