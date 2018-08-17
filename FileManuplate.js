var fs = require('fs');
var path = require('path');
var filesPath = require('path');
var filesFs = require('fs');
var filePath = path.join(__dirname, 'log.txt');
var stringSearcher = require('string-search');
var excelFilename = './SujaiLogFile-1.xlsx';
var Excel = require('exceljs');
var moment = require('moment');
var COUNTCONST = 0;


function fromDir(startPath, filter, callback) {
    return new Promise(function(resolve, reject) {

        if (!filesFs.existsSync(startPath)) {
            // console.log("no dir ", startPath);
            return;
        }

        var files = filesFs.readdirSync(startPath);

        for (var i = 0; i < files.length; i++) {
            var filename = filesPath.join(startPath, files[i]);
            var stat = filesFs.lstatSync(filename);
            if (stat.isDirectory()) {
                // console.log(filename);
                fromDir(filename, filter, callback); //recurse
            } else if (filter.test(filename)) {
                callback(filename);
                COUNTCONST++;
            }
        };
        resolve();
    });
};


fromDir('./SinequaLogs',/\.txt$/,function(filename) {
    console.log('-- found: ',filename);
    var timenow= filesFs.statSync(filename).mtime.getTime()
    var timenow1=moment(timenow);
    if (moment().diff(timenow1, 'days') === 0) {
        processFiles(filename);
    }
}).then(function () {
    if (COUNTCONST === 0) {
        console.log('EMPTY');
        processLogs({});
    }
});

function processFiles () {
    fs.readFile(filePath, { encoding: 'utf-8' }, function(err, buffer) {
        if (err) {
            console.error(err);
        } else {
            stringSearcher.find(buffer, 'error').
            then(function (resultArr) {
                processLogs(resultArr);
            })
        }
    });
}


function processLogs (errorResultData) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFilename)
        .then(function() {
            var currentDate = moment().format('DD-MMM-YYYY');
            var verifiedBy = 'SujaiS';
            var selectCurrentSheet = (moment().format('MMM')).toString();
            var tempResult = '';
            var tempData = '';
            if (workbook.getWorksheet(selectCurrentSheet)) {
                worksheet = workbook.getWorksheet(selectCurrentSheet);
            } else {
                worksheet = workbook.addWorksheet(selectCurrentSheet);
            }
            if (errorResultData.length && errorResultData.length !== 0) {
                for(var i=0; i<errorResultData.length; i++) {
                    tempData = errorResultData[i+1];
                    if(checkDateFormate(i === (errorResultData.length-1) || tempData.text.substring(0, 19))) {
                        if (tempResult === '') {
                            worksheet.addRow([currentDate, verifiedBy, errorResultData[i].text, ''])
                        } else {
                            worksheet.addRow([currentDate, verifiedBy, (tempResult + '\n' + errorResultData[i].text), '']);
                        }
                        tempResult = '';
                    } else {
                        tempResult = tempResult + '\n' + errorResultData[i].text;
                    }
                }
            } else {
                worksheet.addRow([currentDate, verifiedBy, 'No', ' ']);
            }
            workbook.xlsx.writeFile(excelFilename)
                .then(function(){
                    console.log('XSLX file save successfully');
                });
        });
}

function checkDateFormate(dateValue) {
    return moment(dateValue, "YYYY-MM-DD HH:mm:ss").isValid();
}

