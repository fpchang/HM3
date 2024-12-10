import{DB} from '../api/DB';
class HotelServiceClientClass{
	constructor(){
        this.DB=DB;
    }

    

    /** 
     * 获取酒店列表
    */
      async getHotelList(params){
        let {location, maxDistance = 30000,filterVal} = params;
        const db = uniCloud.database();
        const dbCmd = db.command
        console.log('aaaa', location,maxDistance);
        const w =  dbCmd.and(dbCmd.or(
          {
            "hotelName":new RegExp(filterVal, 'i'),
          
        },{
          "hotelAddress":new RegExp(filterVal, 'i'),
        
      }
        
        ),{
        "hotelCoordinate": dbCmd.geoNear({
          geometry: new db.Geo.Point(location[0], location[1]),
          distanceField:"distance",
          minDistance: 0,
          maxDistance: maxDistance,
        })
        });
          let res = await db.collection('hm-hotel').where(w).get()
         return res
      
         
    }
    /** 
     * 获取当前酒店房型信息
    */
    getRoomType(hotel_id){
      return DB.getCollection("hm-roomType",{hotel_id});

}
getCollectHotel(phone){
  return DB.getCollection("hm-collect",{phone})
}
addCollectHotel(phone,hotel_id){
  return DB.add("hm-collect",{phone,hotel_id});
}
cancelCollectHotel(_id){
  return DB.remove("hm-collect",_id);
}
}
//module.exports =new HotelService();
export var HotelServiceClient=new HotelServiceClientClass();