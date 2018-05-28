var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'log.txt');
var stringSearcher = require('string-search');
var excelFilename = './SujaiLogFile-1.xlsx';
var Excel = require('exceljs');
var moment = require('moment');


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

function processLogs (errorResultData) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFilename)
        .then(function() {
            var currentDate = moment().format('DD-MMM-YYYY');
            var verifiedBy = 'SujaiS';
            var selectCurrentSheet = (moment().format('MMM')).toString();
            var tempResult = '';
            var tempData = '';
            worksheet = workbook.getWorksheet(selectCurrentSheet);
            if (errorResultData.length !== 0) {
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
                    // helper.openFile(path);
                });
            // worksheet.commit();
        });
}

function checkDateFormate(dateValue) {
    return moment(dateValue, "YYYY-MM-DD HH:mm:ss").isValid();
}

