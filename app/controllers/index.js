/*
 * This scripts expects a csv file to be placed in the Resources dir.  It will read columns as dicatated by the code below.
 * Then it will update the values of each project in ACS.
 */

var Cloud = require('ti.cloud');

var user = "csc";
var password = "1234";
var filename = "projects.tsv";

var projectIdCol = 0;
var collectionIdCol = 1;
var industryIdCol = 2;
var videosCol = 3;
var appUrlAndroidCol = 4;
var appUrliOSCol = 5;
var nameCol = 6;
var descriptionCol = 7;
var featuredCol = 8;
var tagsCol = 9;
var publishCol = 10;
var dateAddedCol = 11;
var dateUpdatedCol = 12;
var contactCol = 13;

var endCol = contactCol;

function updateProject(projectid, fields, tags) {
	Cloud.Objects.update({
		classname : 'projects',
		id : projectid,
		//tags : tags,
		fields : fields
	}, function(e) {
		if (e.success) {
			var project = e.projects[0];
			Ti.API.info('Success:\n' + 'id: ' + project.id + '\n' + 'updated_at: ' + project.updated_at);
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function displayDialog(projectId, fields, tags) {
	Ti.UI.setBackgroundColor('white');
	var dialogMsg = "Update project:" + projectId + " with tags:" + JSON.stringify(tags) + " and fields: " + JSON.stringify(fields);
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
			updateProject(projectId, fields, tags);
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
	var csv = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, filename);

	if (!csv.exists()) {
		alert("did not find file");
	} else {
		var delimiter = "\t";
		var csvContents = csv.read().text;
		//Remove
		csvContents = csvContents.replace(/(\r\n|\n|\r)/gm, delimiter);
		var csvArray = csvContents.split(delimiter);

		var j = 0;
		var projectId = null;
		var collectionId = null;
		var industryId = null;
		var videos = null;
		var name = null;
		var description = null;
		var featured = null;
		var tags = null;
		var appUrlAndroid = null;
		var appUrliOS = null;
		var publish = null;
		var dateAdded = null;
		var dateUpdated = null;
		var contact = null;

		var first = true;
		for (var i = 0; i < csvArray.length; i++) {
			var value = csvArray[i];

			if (j == projectIdCol) {
				projectId = value;
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
			} else if (j == tagsCol) {
				tags = value;
			} else if (j == appUrlAndroidCol) {
				appUrlAndroid = value;
			} else if (j == appUrliOSCol) {
				appUrliOS = value;
			} else if (j == publishCol) {
				publish = value;
			} else if (j == dateAddedCol) {
				dateAdded = value;
			} else if (j == dateUpdatedCol) {
				dateUpdated = value;
			} else if (j == contactCol) {
				contact = value;
			}
			if (j == endCol) {
				//Skip the header
				if (first) {
					first = false;
					j = 0;
					continue;
				}
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
				if (collectionId) {
					fields["collection_id"] = collectionId;
				}
				if (industryId) {
					fields["industry_id"] = industryId;
				}
				if (videos) {
					fields["videos"] = videos;
				}
				if (name) {
					fields["name"] = name;
				}
				if (description) {
					fields["description"] = description;
				}
				if (featured) {
					var boolVal = false;
					if (featured == 1) {
						boolVal = true;
					}
					fields["featured"] = boolVal;
				}
				if (publish) {
					fields["publish"] = publish;
				}
				if (appUrliOS) {
					fields["app_url_ios"] = appUrliOS;
				}
				if (appUrlAndroid) {
					fields["app_url_android"] = appUrlAndroid;
				}
				if (dateUpdated) {
					fields["date_updated"] = dateUpdated;
				}
				if (contact) {
					fields["contact"] = contact;
				}
				if (dateAdded) {
					fields["date_added"] = dateAdded;
				}
				if (isEmpty(fields)) {
					alert("Cant have an empty dict for projectId " + projectId);
					break;
				}
				displayDialog(projectId, fields, tags);

				Ti.API.info('looping');

				projectId = null;
				collectionId = null;
				industryId = null;
				videos = null;
				name = null;
				description = null;
				featured = null;
				tags = null;
				appUrlAndroid = null;
				appUrliOS = null;
				publish = null;
				dateAdded = null;
				dateUpdated = null;
				contact = null;
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