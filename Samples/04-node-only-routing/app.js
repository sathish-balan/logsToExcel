var url = require('url');
var fs = require('fs');
var path = require('path');
var filePathLocaltion = path.join(__dirname, 'log.txt');
console.log(filePathLocaltion);
var stringSearcher = require('string-search');
var filename = 'sample.xlsx';

function renderHTML(path, response) {
    fs.readFile(filePathLocaltion, { encoding: 'utf-8' }, function(err, buffer) {
        if (err) {
            console.error(err);
        } else {
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
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}

module.exports = {
  handleRequest: function(request, response) {
      response.writeHead(200, {'Content-Type': 'text/html'});

      var path = url.parse(request.url).pathname;
      switch (path) {
          case '/':
              renderHTML('./index.html', response);
              break;
          case '/login':
              renderHTML('./login.html', response);
              break;
          default:
              response.writeHead(404);
              response.write('Route not defined');
              response.end();
      }

  }
};