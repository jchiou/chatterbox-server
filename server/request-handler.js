
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

// specific to post
var collectData = function(request, callback) {
  var data = "";
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
};

var messages = [];


module.exports.requestHandler = function(request, response) {
  
  if (request.url !== '/arglebargle') {
    console.log(request.url);
    if (request.method === 'OPTIONS') {
      sendResponse(response, 'hello', 200);
    } 
    //console.log('Serving request type ' + request.method + ' for url ' + request.url);
    if (request.method === 'GET') {
      sendResponse(response, {results: messages});
    } else if (request.method === 'POST') {
      collectData(request, function(message) {
        messages.push(message);
        //console.log(messages);
        sendResponse(response, messages, 201);
      }); 
    } else if (request.method === 'OPTIONS') {
      sendResponse(response, 'hello', 200);
    }  
  } else {
    sendResponse(response, null, 404)
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
