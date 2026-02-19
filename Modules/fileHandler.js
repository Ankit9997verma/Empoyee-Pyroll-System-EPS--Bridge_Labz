const { log } = require('console');
const fs  = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..' ,"employees.json");


function readFile() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }   
}

function writeFile(data) {
    try {
        fs.writeFileSync   (filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error writing file:", err);
    }
}

module.exports = {
    readFile,
    writeFile
};  


