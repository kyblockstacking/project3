var db = require("../models");

module.exports = function (app) {

   app.post("api/forumCategory/", function(req, res) {
        var category = req.body;
        db.Category.create(category).then(function(result) {
            res.end();
        });

   });
            }
    