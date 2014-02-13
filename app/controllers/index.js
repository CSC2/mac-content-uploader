var Cloud = require('ti.cloud');

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

function updateProject(projectid, fields) {
	Cloud.Objects.update({
		classname : 'projects',
		id : projectid,
		fields : fields
	}, function(e) {
		if (e.success) {
			var project = e.projects[0];
			alert('Success:\n' + 'id: ' + project.id + '\n' + 'updated_at: ' + project.updated_at);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function displayDialog(projectId, fields) {
	Ti.UI.setBackgroundColor('white');
	var dialogMsg = "Update project:" + projectId + " with the following: " + JSON.stringify(fields);
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Confirm', "Cancel"],
		message : dialogMsg,
		title : 'Confirm Update'
	});
	dialog.addEventListener('click', function(e) {
		var indexClick = e.index;
		if (indexClick === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else if (indexClick === 0) {
			//updateProject(projectId, fields);
		}
	});
	dialog.show();
}

function isEmpty(map) {
	for (var key in map) {
		if (map.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}

function readCsv(projectIds) {
	//var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'Resources','route.csv');
	//var csv = f.read();

	var csv = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, filename);

	if (!csv.exists()) {
		alert("did not find file");
	} else {
		//var csvContents = csv.read();
		//var csvArray = csvContents.split(',');
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

		for (var i = 0; i < csvArray.length; i++) {
			var value = csvArray[i];

			if (j == projectIdCol) {
				projectId = value;
				projectId = "52b484ffb29dc80b660002a4";
			} else if (j == collectionIdCol) {
				collectionId = value;
			} else if (j == industryIdCol) {
				industryId = value;
			} else if (j == videosCol) {
				videos = value;
			} else if (j == nameCol) {
				name = value;
			} else if (j == descriptionCol) {
				description = value;
			} else if (j == featuredCol) {
				featured = value;
				j = -1;
				if (!projectId) {
					alert("project id can't be null");
					break;
				}
				var match = false;
				for (var k = 0; k < projectIds.length; k++) {
					var projId = projectIds[k];
					if (projId == projectId) {
						match = true;
					}
				}
				if (!match) {
					alert("project id:" + projectId + " does not exist in ACS");
					break;
				}
				var fields = {};
				if (!collectionId) {
					fields["collection_id"] = collectionId;
				}
				if (!industryId) {
					fields["industry_id"] = industryId;
				}
				if (!videos) {
					fields["videos"] = videos;
				}
				if (!name) {
					fields["name"] = name;
				}
				if (!description) {
					fields["description"] = description;
				}
				if (!featured) {
					var boolVal = false;
					if (featured == 1) {
						boolVal = true;
					}
					fields["featured"] = boolVal;
				}
				fields["description"] = 'description';
				if (isEmpty(fields)) {
					alert("Cant have an empty dict for projectId " + projectId);
					break;
				}
				displayDialog(projectId, fields);

				Ti.API.info('looping');

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
	}
}

function doClick(e) {
	function getProjectsCallback(projectsCallback) {
		if (projectsCallback.success) {
			var photos = [];
			var projectIds = [];
			for (var i = 0; i < projectsCallback.projects.length; i++) {
				var project = projectsCallback.projects[i];
				var projectId = project.id;
				projectIds.push(projectId);
			}
			readCsv(projectIds);
		}
	}

	function loginCallBack(logincallback) {
		if (logincallback.success) {
			getProjects(getProjectsCallback);
		} else {
			alert('It seems your password is outdated in ACS, please send an email to pbryzek@csc.com.');
		}
	}

	loginUser(user, password, loginCallBack);
}

function getProjects(callback) {
	Cloud.Objects.query({
		classname : 'projects'
	}, function(e) {
		callback(e);
	});
}

function loginUser(user, password, callback) {
	Cloud.Users.login({
		login : user,
		password : password
	}, function(e) {
		callback(e);
	});
}

$.index.open();

if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	var touchTestModule = undefined;
	try {
		touchTestModule = require("com.soasta.touchtest");
	} catch (tt_exception) {
		Ti.API.error("com.soasta.touchest module is required");
	}

	var cloudTestURL = Ti.App.getArguments().url;
	if (cloudTestURL != null) {
		// The URL will be null if we don't launch through TouchTest.
		touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
	}

	Ti.App.addEventListener('resumed', function(e) {
		// Hook the resumed from background
		var cloudTestURL = Ti.App.getArguments().url;
		if (cloudTestURL != null) {
			touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
		}
	});
}