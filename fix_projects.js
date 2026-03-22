const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'projects.html');
let content = fs.readFileSync(filePath, 'utf8');

const startIdx = content.indexOf('const PROJECTS_DATA = [');
const endIdx = content.indexOf('];', startIdx);
let projectsDataStr = content.substring(startIdx, endIdx);

const pattern = /(image:\s*"(.*?)",\s*gallery:\s*\[\s*)"([^"]+)"(,?)(.*?)(\])/gs;

projectsDataStr = projectsDataStr.replace(pattern, (match, preGroup, oldImage, firstImg, comma, restItems, endBracket) => {
    // preGroup is `image: "oldImage", gallery: [\n  `
    const newPre = preGroup.replace(/"(.*?)"/, `"${firstImg}"`);

    // newPre now has the firstImg set as the image prop value.
    // The restItems will be the second and third items (e.g. `\n "foo.png", \n "bar.png"\n `)
    // If there were only one item, comma is empty, restItems is spaces.

    return `${newPre}${restItems}${endBracket}`;
});

let newContent = content.substring(0, startIdx) + projectsDataStr + content.substring(endIdx);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Replacement complete.');
