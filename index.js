var Twitter = require('twitter');
scrapeIt = require("scrape-it")
var cron = require('node-cron');
const dotenv = require('dotenv')
dotenv.config()


var params = {screen_name: 'Snowbird bot'};

cron.schedule('0 8 * * *', () => {
scrapeIt("https://www.snowbird.com/mountain-report/", {
    lifts: "div:nth-child(2) > div.sb-condition_values > a > span",
    trails: " div:nth-child(4) > div.sb-condition_values > a > span",
    road: ".roads-open > div.sb-condition_values > a > span",
    twelvehrs: ".snow-report-current.no-edit-bar > div.conditions-data > div.conditions > div:nth-child(1) > div.sb-condition_values > div",
    twentyfourhrs: ".snow-report-current.no-edit-bar > div.conditions-data > div.conditions > div:nth-child(2) > div.sb-condition_values > div",
    tram: "#lifts-anchor > div > div:nth-child(1) > div:nth-child(1)",
    ytd: "div:nth-child(5) > div.sb-condition_values > div",
    depth: "div.conditions > div:nth-child(4) > div.sb-condition_values > div",
    basetemp: "div.conditions > div:nth-child(6) > div.sb-condition_values > div",
    windspeed: ".one-line > div.sb-condition_values > div",
    baldy: "#gates-anchor > div > div:nth-child(4) > div.status",
    cirque: "#gates-anchor > div > div:nth-child(2) > div.status"
}).then(({
    data,
    response
}) => {
    res = `Snowbird currently has ${data.lifts} lifts running, and ${data.road} the road is passable.  Right now ${data.trails} trails are open with ${data.twelvehrs} in the last 12 hrs, ${data.twentyfourhrs} in the last 24, ${data.ytd} ytd, and ${data.depth} base depth. Currently the base temperature is ${data.basetemp} and the winds are blowing ${data.windspeed}.  The tram is currently ${data.tram}, High Baldy is ${data.baldy}, and the Cirque is ${data.cirque}.`
    console.log(res)
    var time = new Date(Date.now()).toLocaleString();
    var client = new Twitter({
        consumer_key:  process.env.CONSUMERKEY,
        consumer_secret: process.env.CONSUMERSECRET,
        access_token_key: process.env.ATOKENKEY,
        access_token_secret: process.env.ATOKENSECRET
      });
      
    client.post('statuses/update', { status: `${time} - ${res}` },  function(error, tweet, response) {
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        console.log(response);  // Raw response object.
      });
})
})