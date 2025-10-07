'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		hotel_id,
		hotelObj
	} = event;
	//console.log("hm_updateHotel", event);
	if(!hotel_id){
		throw new Error("缺少hotel_id")
	}
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	})
	const db = uniCloud.database();
	const dCmd = db.command;
	try{
		let  obj ={
					belong: hotelObj.belong,
					hotelName: hotelObj.hotelName,
					hotelAddressCode: hotelObj.hotelAddressCode,
					hotelAddress: hotelObj.hotelAddress,
					hotelAddressArea: hotelObj.hotelAddressArea,
					hotelCoordinate: hotelObj.hotelCoordinate,
					hotelIntroduction: hotelObj.hotelIntroduction,
					"firstImages": hotelObj.firstImages,
					"imagesList": hotelObj.imagesList,
					"cateringServices": hotelObj.cateringServices,
					baseFacility:hotelObj.baseFacility,
					"recreationFacility": hotelObj.recreationFacility,
					"athleticFacility": hotelObj.athleticFacility,
					serviceTel: hotelObj.serviceTel,
					wechat: hotelObj.wechat,
					feature: hotelObj.feature
				} 
		const result = await dbJQL.collection('hm-hotel').doc(hotel_id).update(obj);
		return result;
	}catch(e){
		throw new Error(e)
	}
	
};