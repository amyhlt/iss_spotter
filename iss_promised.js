const request = require('request-promise-native');
const fetchMyIP = function() {
    return request('https://api.ipify.org?format=json');
  };
  
const fetchCoordsByIP = function(body) {
    const ip = JSON.parse(body).ip;
    return request(`https://freegeoip.app/json/${ip}`);
};
const fetchISSFlyOverTimes = function(body) {
    const { latitude, longitude } = JSON.parse(body);
    const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
    return request(url);
  };

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes }; 


  

