import{DB} from '../api/DB';
class HotelServiceClass{
	constructor(){
        this.DB=DB;
    }

    
    /**
     *
     *
     * @param {*} hotelObj
     * @return {*} 
     * @memberof HotelService
     */
    createHotel(hotelObj){
      return   DB.callFunction("hm_createHotel",{hotelObj});
    }
    updateHotel(hotel_id,hotelObj){
      return   DB.callFunction("hm_updateHotel",{hotel_id,hotelObj});
    }
    deleteHotel(hotel_id){
      return   DB.callFunction("hm_deleteHotel",{hotel_id});
    }
    /** 
     * 获取当前用户关联酒店列表(包括老板与用户)
    */
      getHotelList(){
            return DB.callFunction("hm_getHotelList");
         
    }
/**
 *所属于 当前用户酒店
 */
    getHotelListOfUser(phone){
      return DB.getCollection("hm-hotel",{belong:phone})
    }
    /**
     * 根据id获取酒店信息
     */
    getHotelInfoById(hotel_id){
        return this.DB.getCollection("hm-hotel",{_id:hotel_id})
    }
    
    /** 
     * 获取当前酒店房型信息
    */
     getRoomType(hotel_id){
           return DB.callFunction(
                "hm_getRoomType",
                {hotel_id}
            );
            let obj = res.result.data.length?res.result.data:[];
           return obj;
     
   }
   /** get employeeList */
   getEmployeeList(hotel_id){
    return DB.getCollectionGroupBy("hm-employee",{hotel_id},"role asc")
   }
   /**
    * 房价添加
    * @param {*} data 
    */
   addRoomTypePrice(list){
     return DB.add("hm-roomTypePrice",list)
   }
}
//module.exports =new HotelService();
export var HotelService=new HotelServiceClass();