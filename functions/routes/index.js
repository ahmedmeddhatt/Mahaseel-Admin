const user = require("./user.route");
const crop = require("./crop.route");
const quality = require("./quality.route");
const request = require("./request.route");
const location = require("./location.route");
const cert = require("./cert.route");
const media = require("./media.route");
const dashboard = require("./dashboard.route");
const newsletter = require("./newsletter.route");
const topics = require("./topics.route");
const posts = require("./posts.route");

module.exports = {
    crop,
    quality,
    location,
    request,
    cert,
    media,
    dashboard,
    newsletter,
    topics,
    posts,
    user
};