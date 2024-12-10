import{DB} from '../api/DB';
class HotelServiceClientClass{
	constructor(){
        this.DB=DB;
    }

    

    /** 
     * 获取酒店列表
    */
      async getHotelList(params){
        let {location, maxDistance = 300000,filterVal} = params;
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
    async getRoomType(hotel_id){
     //const rr= await this.getRemainRoomType(hotel_id,new Date("2024-12-11").getTime(),new Date("2024-12-13").getTime());
    // console.log("剩余房量",rr)
      return DB.getCollection("hm-roomType",{hotel_id});

    }
    async getRemainRoomType(hotel_id,st,et){
      const db = uniCloud.database();
      const dbCmd = db.command
     let startTime = new Date( new Date(st).Format( "yyyy/MM/dd")  + " 14:00:00").getTime();
      let endTime = new Date(new Date(et).Format( "yyyy/MM/dd") + " 12:00:00").getTime();

      // let jql =`hotel_id=='${hotel_id}'&&orderStatus!=10&&(`+
      //   `${endTime}<=checkInEndDateTimeStamp&&${endTime}>checkInStartDateTimeStamp||` +
      //   `${startTime}>=checkInStartDateTimeStamp&&${endTime}<=checkInEndDateTimeStamp||` +
      //   `${startTime}<=checkInStartDateTimeStamp&&${endTime}>=checkInEndDateTimeStamp)`;

        let W =  dbCmd.and({"hotel_id":dbCmd.eq(hotel_id),"orderStatus":dbCmd.neq(10)},
          dbCmd.or(
          {"checkInEndDateTimeStamp":dbCmd.gte(endTime),"checkInStartDateTimeStamp":dbCmd.lt(endTime)},
          {"checkInStartDateTimeStamp":dbCmd.lte(startTime),"checkInEndDateTimeStamp":dbCmd.gte(endTime)},
          {"checkInStartDateTimeStamp":dbCmd.gte(startTime),"checkInEndDateTimeStamp":dbCmd.lte(endTime)}
           
        ));
        console.log("w",W)
      let result;
      const roomTypeListRes = await this.getRoomType(hotel_id)
      let roomTypeList = roomTypeListRes.result.data;
      console.log("YYYY11",roomTypeList);
      const usedListRes= await DB.getCollection('hm-order',W) //dbJQL.collection('hm-order').where(jql).get();
      let userRoomList=usedListRes.result.data;
      console.log("yyyy2",userRoomList)
      let remainList=roomTypeList.map(item=>{
        let sumCount =0;
        for(const it of userRoomList){
          let is = it.roomTypeArray.find(i=>{return i.roomType_id==item._id});
          if(is){
            sumCount+=is.count
            continue;
          }
          
        }
        item.remainCount=Math.max(item.count-sumCount,0);
        return item;
      })
      console.log("yyy222",remainList);
      //return remainList.filter(item=>item.remainCount>0);
      return remainList;
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