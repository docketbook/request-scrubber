"use strict";

let validIds = ["0ba29cce-25f4-47ea-965c-78b075d6ba04", "7f29afde-feea-457c-98f8-84c2697cdba2"]

exports.get = function(uuid, cb) {
	if (validIds.indexOf(uuid) === -1) {
		return cb(null, null);
	} else {
		return cb(null, {
			id: uuid, 
			name: "something"
		});
	}
}

exports.getMany = function(uuids, cb) {
	let returnVals = [];
	uuids.forEach(function(uuid) {
		if (validIds.indexOf(uuid) !== -1) {
			returnVals.push({
				id: uuid, 
				name: "something"
			});
		}
	});
	return cb(null, returnVals);
}