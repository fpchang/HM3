
import{DB} from '../../api/DB'
import {HotelServiceClient} from '../../services/HotelServiceClient';
export default{
	namespaced: true,
	state: { //存放状态
		hotelList:null,
		hotel:null,
		roomType:null,
		searchCondition:{}
	},

	mutations: {
		updateSearchCondition(state,obj){
			state.searchCondition=obj;
		},
		updateHotelList(state, list) {
			console.log("client set")
			state.hotelList = list;
		},
		updateHotel(state,hotel){
			state.hotel=hotel;
		},
		updateRoomType(state,roomType){
			state._roomType=roomType;
		}
        
	},
  actions:{
    async  getHotelList(context,params){
		const res = await HotelServiceClient.getHotelList(params);
		console.log("客户端hotelist",res);
		context.commit("updateHotelList",res.result.data);
		return res;
     
    }
  }
}