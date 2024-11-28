import{DB} from '../api/DB';
class HotelServiceClientClass{
	constructor(){
        this.DB=DB;
    }

    

    /** 
     * 获取酒店列表
    */
      async getHotelList(params){
        let {point, maxDistance = 30000,filterVal} = params;
        const db = uniCloud.database();
        const dbCmd = db.command
        console.log('aaaa', point,maxDistance);
        const w =  dbCmd.and(dbCmd.or(
          {
            "hotelName":new RegExp(filterVal, 'i'),
          
        },{
          "hotelAdress":new RegExp(filterVal, 'i'),
        
      }
        
        ),{
        "hotelCoordinate": dbCmd.geoNear({
          geometry: new db.Geo.Point(point[0], point[1]),
          distanceField:"distance",
          minDistance: 0,
          maxDistance: maxDistance,
        })
        });
          let res = await db.collection('hm-hotel').where(w).get()
         return res
      
         
    }
 

}
//module.exports =new HotelService();
export var HotelServiceClient=new HotelServiceClientClass();