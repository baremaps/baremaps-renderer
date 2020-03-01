let mbgl = require('@mapbox/mapbox-gl-native');
let sharp = require('sharp');
let request = require('request');

let params = {
    style: "https://www.baremaps.com/style.json",
    ratio: 2,
    width: 1600,
    height: 1200,
    center: [6.57478, 46.52067],
    zoom: 18,
    bearing: 0, 
    pitch: 90
};

request({ 
    url: params.style 
}, function (err, res, body) {
    let map = new mbgl.Map({
        ratio: params.ratio,
        request: function (req, callback) {
            request({
                url: req.url,
                encoding: null,
                gzip: true
            }, function (err, res, body) {
                if (err) {
                    callback(err);
                } else if (res.statusCode == 200) {
                    let response = {};
                    if (res.headers.modified) { response.modified = new Date(res.headers.modified); }
                    if (res.headers.expires) { response.expires = new Date(res.headers.expires); }
                    if (res.headers.etag) { response.etag = res.headers.etag; }
                    response.data = body;
                    callback(null, response);
                } else {
                    callback(new Error(JSON.parse(body).message));
                }
            });
        },
    });
    map.load(body);
    map.render({ 
        zoom: params.zoom, 
        center: params.center, 
        width: params.width, 
        height: params.height, 
        bearing: params.bearing, 
        pitch: params.pitch 
    }, function (err, buffer) {
        if (err) throw err;
        map.release();
        let image = sharp(buffer, {
            raw: {
                width: params.width * params.ratio,
                height: params.height * params.ratio,
                channels: 4
            }
        });
        image.toFile('image.png', function (err) {
            if (err) throw err;
        });
    });
});


