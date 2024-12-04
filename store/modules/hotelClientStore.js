
import{DB} from '../../api/DB'
import {HotelServiceClient} from '../../services/HotelServiceClient';
export default{
	namespaced: true,
	state: { //存放状态
		hotelList:[]
	},

	mutations: {
		//调用 this.$store.commit('updateHotelList',[])
		updateHotelList(state, list) {
			console.log("client set")
			state.hotelList = list;
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