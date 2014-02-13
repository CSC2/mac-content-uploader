function Controller() {
    function displayDialog(projectId, fields) {
        Ti.UI.setBackgroundColor("white");
        var dialogMsg = "Update project:" + projectId + " with the following: " + JSON.stringify(fields);
        var dialog = Ti.UI.createAlertDialog({
            cancel: 1,
            buttonNames: [ "Confirm", "Cancel" ],
            message: dialogMsg,
            title: "Confirm Update"
        });
        dialog.addEventListener("click", function(e) {
            var indexClick = e.index;
            indexClick === e.source.cancel ? Ti.API.info("The cancel button was clicked") : 0 === indexClick;
        });
        dialog.show();
    }
    function isEmpty(map) {
        for (var key in map) if (map.hasOwnProperty(key)) return false;
        return true;
    }
    function readCsv(projectIds) {
        var csv = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, filename);
        if (csv.exists()) {
            var csvArray = [];
            csvArray.push("1");
            csvArray.push("2");
            csvArray.push("3");
            csvArray.push("4");
            csvArray.push("5");
            csvArray.push("6");
            csvArray.push("7");
            csvArray.push("8");
            csvArray.push("9");
            csvArray.push("10");
            csvArray.push("11");
            csvArray.push("12");
            csvArray.push("13");
            csvArray.push("14");
            var j = 0;
            var projectId = null;
            var collectionId = null;
            var industryId = null;
            var videos = null;
            var name = null;
            var description = null;
            var featured = null;
            for (var i = 0; csvArray.length > i; i++) {
                var value = csvArray[i];
                if (j == projectIdCol) {
                    projectId = value;
                    projectId = "52b484ffb29dc80b660002a4";
                } else if (j == collectionIdCol) collectionId = value; else if (j == industryIdCol) industryId = value; else if (j == videosCol) videos = value; else if (j == nameCol) name = value; else if (j == descriptionCol) description = value; else if (j == featuredCol) {
                    featured = value;
                    j = -1;
                    if (!projectId) {
                        alert("project id can't be null");
                        break;
                    }
                    var match = false;
                    for (var k = 0; projectIds.length > k; k++) {
                        var projId = projectIds[k];
                        projId == projectId && (match = true);
                    }
                    if (!match) {
                        alert("project id:" + projectId + " does not exist in ACS");
                        break;
                    }
                    var fields = {};
                    collectionId || (fields["collection_id"] = collectionId);
                    industryId || (fields["industry_id"] = industryId);
                    videos || (fields["videos"] = videos);
                    name || (fields["name"] = name);
                    description || (fields["description"] = description);
                    if (!featured) {
                        var boolVal = false;
                        1 == featured && (boolVal = true);
                        fields["featured"] = boolVal;
                    }
                    fields["description"] = "description";
                    if (isEmpty(fields)) {
                        alert("Cant have an empty dict for projectId " + projectId);
                        break;
                    }
                    displayDialog(projectId, fields);
                    Ti.API.info("looping");
                    projectId = null;
                    collectionId = null;
                    industryId = null;
                    videos = null;
                    name = null;
                    description = null;
                    featured = null;
                }
                j++;
            }
        } else alert("did not find file");
    }
    function doClick() {
        function getProjectsCallback(projectsCallback) {
            if (projectsCallback.success) {
                var projectIds = [];
                for (var i = 0; projectsCallback.projects.length > i; i++) {
                    var project = projectsCallback.projects[i];
                    var projectId = project.id;
                    projectIds.push(projectId);
                }
                readCsv(projectIds);
            }
        }
        function loginCallBack(logincallback) {
            logincallback.success ? getProjects(getProjectsCallback) : alert("It seems your password is outdated in ACS, please send an email to pbryzek@csc.com.");
        }
        loginUser(user, password, loginCallBack);
    }
    function getProjects(callback) {
        Cloud.Objects.query({
            classname: "projects"
        }, function(e) {
            callback(e);
        });
    }
    function loginUser(user, password, callback) {
        Cloud.Users.login({
            login: user,
            password: password
        }, function(e) {
            callback(e);
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createButton({
        title: "Upload content to ACS?",
        id: "label"
    });
    $.__views.index.add($.__views.label);
    doClick ? $.__views.label.addEventListener("click", doClick) : __defers["$.__views.label!click!doClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Cloud = require("ti.cloud");
    var user = "pbryzek";
    var password = "PaulBryz1984!";
    var filename = "test.txt";
    var projectIdCol = 0;
    var collectionIdCol = 1;
    var industryIdCol = 2;
    var videosCol = 3;
    var nameCol = 4;
    var descriptionCol = 5;
    var featuredCol = 6;
    $.index.open();
    if ("iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname) {
        var touchTestModule = void 0;
        try {
            touchTestModule = require("com.soasta.touchtest");
        } catch (tt_exception) {
            Ti.API.error("com.soasta.touchest module is required");
        }
        var cloudTestURL = Ti.App.getArguments().url;
        null != cloudTestURL && touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
        Ti.App.addEventListener("resumed", function() {
            var cloudTestURL = Ti.App.getArguments().url;
            null != cloudTestURL && touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
        });
    }
    __defers["$.__views.label!click!doClick"] && $.__views.label.addEventListener("click", doClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;