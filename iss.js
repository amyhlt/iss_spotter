/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");
const fetch = require('node-fetch');

const fetchMyIP = function(callback) {
    request('https://api.ipify.org?format=json', (err, response, body) => {
      if (err) {
      return callback(err, null);
      }
      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        const userIP = JSON.parse(body).ip;
        return callback(null, userIP );
      }
    });
}
const fetchCoordsByIP = function(ip, callback) {
    request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
        return;
      }
  
      const { latitude, longitude } = JSON.parse(body);
  
      callback(null, { latitude, longitude });
    });
  };
  // iss.js

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
    const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  
    request(url, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
        return;
      }
  
      const passes = JSON.parse(body).response;
      callback(null, passes);
    });
  };
  
  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };
  
module.exports = { fetchMyIP, fetchCoordsByIP,fetchISSFlyOverTimes,nextISSTimesForMyLocation};