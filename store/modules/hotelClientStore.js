
import{DB} from '../../api/DB'
import {HotelServiceClient} from '../../services/HotelServiceClient';
export default{
	namespaced: true,
	state: { //存放状态
		currentHotel_id:"",
		hotelList:[],
		searchCondition:{}
	},

	mutations: {
		updateSearchCondition(state,obj){
			this.searchCondition=obj;
		},
		updateHotelList(state, list) {
			console.log("client set")
			state.hotelList = list;
		},
		updateCurrentHotel_id(state, hotel_id) {
			state.currentHotel_id = hotel_id;
		}
        
	},
  actions:{
	getTT(){
		console.log("clent tt")
	},
    async  getHotelList(context,params){
		const res = await HotelServiceClient.getHotelList(params);
		console.log("客户端hotelist",res);
		context.commit("updateHotelList",res.result.data);
		return res;
     
    }
  }
}