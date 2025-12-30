'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		_id,
		roomTypeObj
	} = event;
	console.log("hm_updateRoomType", event,context);
	if(!_id){
		return new Promise((resolve,reject)=>{
			reject({errMsg:"缺少_id",errCode:"300"});
		})
	}
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	})
	const db = uniCloud.database();
	const dCmd = db.command;

	if(context.appVersionCode<213){
		return updateHy_vmax212(_id,roomTypeObj,dbJQL);
		
	}			
	const result = await dbJQL.collection('hm-roomType').doc(_id).update(roomTypeObj);
	return result;
};
async function updateHy_vmax212(_id,roomTypeObj,dbJQL){
	let obj = {
				    "count": roomTypeObj.count,
				    "name": roomTypeObj.name,
					"area":roomTypeObj.area,
					//"isBathtub":roomTypeObj.isBathtub,
					//"isBalcony":roomTypeObj.isBalcony,
					"isWindow":roomTypeObj.isWindow,
					"guestNumber":roomTypeObj.guestNumber,
					"firstImages":roomTypeObj.firstImages||"",
					"imagesList": roomTypeObj.imagesList||[],
					//"disposableToiletries":roomTypeObj.disposableToiletries,
					"bedList":roomTypeObj.bedList,
				    "roomList":roomTypeObj.roomList,
					"facility":roomTypeObj.facility||[],
					"priceBase_name":roomTypeObj.priceBase_name,
					"priceA_name":roomTypeObj.priceA_name,
					"priceB_name":roomTypeObj.priceB_name,
					"priceBase":roomTypeObj.priceBase,
					"priceA":roomTypeObj.priceA,
					"priceB":roomTypeObj.priceB,
					isBargain:roomTypeObj.isBargain,
					bargainMinPercent:roomTypeObj.bargainMinPercent
				}
				let id = _id._value;
				const result = await dbJQL.collection('hm-roomType').doc(id).update(obj);
		return result;
}