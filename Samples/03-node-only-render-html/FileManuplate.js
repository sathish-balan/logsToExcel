const fs = require('fs');
const path = require('path');
var filePath = path.join(__dirname, 'log.txt');
console.log(filePath);
var stringSearcher = require('string-search');
var filename = 'sample.xlsx';
fs.readFile(filePath, { encoding: 'utf-8' }, (err, buffer) => {
    if (err) {
        console.error(err);
    }else {
        console.log(buffer);
        stringSearcher.find(buffer, 'error').
        then(function (resultArr)
        {
            console.log("-----------------------------------------++++++++");
            console.log(JSON.stringify(resultArr));
            console.log("-----------------------------------------++++++++");
            //  .xlsx.writeFile(resultArr);
            //fs.writeFile('sa.txt',worksheet)
        })
    }
});