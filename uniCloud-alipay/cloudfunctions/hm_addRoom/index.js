'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		roomObj
	} = event;
	console.log("hm_addRoom", event);
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	})
	//const db = uniCloud.database();
	//const dCmd = db.command;
	const result = await dbJQL.collection('hm-room').add(roomObj);
	return result;
};