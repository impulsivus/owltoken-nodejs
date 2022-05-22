const request = require("request");

const AUTHORITY = "wzavfvwgfk.execute-api.us-east-2.amazonaws.com"
const URL = "https://pk0yccosw3.execute-api.us-east-2.amazonaws.com/production/v2/sentinel-tracking/owl"
const ORIGIN = "https://overwatchleague.com"
const API_URL = "https://owlwb.glitch.me/api/live"
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
const AC = "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"

var is_live = false
var live_id = 0;

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (X11; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0",
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0",
]

const user_agent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

const api_options = {
    url: API_URL,
    headers: {
        'User-Agent': user_agent
    }
};

function api_callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        //console.log(body);
        if (info.status === "IN_PROGRESS") is_live = true; else is_live = false;
        live_id = info.id;
    }
}
function post_callback(error, response, body) {
    //if (!error && response.statusCode == 200) {
    //const info = JSON.parse(body);
    console.log(body);
    /*} else {
        console.log(error);
    }*/
}
function options_callback(error, response, body) {
    //if (!error && response.statusCode == 200) {
    //const info = JSON.parse(body);
    console.log(`OPTIONS statusCode: ${response.statusCode}`);
    /*} else {
        console.log(error);
    }*/
}

const check_millis = 1000 * 60 * 0.1;

setInterval(() => {
    request(api_options, api_callback);
    console.log(`is_live: ${is_live}`);
}, check_millis);

const live_millis = 1000 * 60 * 0.1;

setInterval(() => {
    if (is_live) {
        var  referer =`https://overwatchleague.com/en-us/match/${live_id}/`
        console.log(`referer: ${referer}`);
        const options = {
            url: URL,
            headers: {
                "User-Agent": user_agent,
                "Accept-Language": "en-GB,en;q=0.5",
                "Referer": referer,
                "Origin": "https://overwatchleague.com",
                "DNT": "1",
                "Connection": "keep-alive",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "TE": "Trailers",
                "Accept": "application/json",
                "x-origin": "overwatchleague.com",
                "Content-Type": "application/json",
            },
            form: {
                "accountId": "123456789",
                "videoId": live_id,
                "type": "video_player",
                "entryId": "bltfed4276975b6d58a",
                "liveTest": false,
                "locale": "en-us",
            }
        };
        const opt_options = {
            url: URL,
            headers: {
                "Referer": referer,
                'Accept': '*/*',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type,x-origin'
            }
        };
        console.log(live_id);
        request.post(options, post_callback);
        request.options(opt_options, options_callback);
    }
}, live_millis);
