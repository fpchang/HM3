
import{DB} from '../../api/DB'
import {MenuService} from '../../services/MenuService';


//Vuex.Store 构造器选项
export default{
	state: { //存放状态
		menuList:null,
		orderDishesList:null,//未来餐饮订单
		orderDishesToday:[] //今日预定的餐饮订单
	},

	mutations: {
		//调用 this.$store.commit('updateHotelList',[])
		updateMenuList(state, list=[]) {
			state.menuList = list;
		},
		updateOrderDishesList(state, list=[]){
			state.orderDishesList = list;
		},
		updateOrderDishesToday(state,list=[]){
			state.orderDishesToday = list;
		}
	},
  actions:{
     getMenuList(context,hotel_id){
		return new Promise((resolve,reject)=>{
			MenuService.getMenuList(hotel_id).then(res=>{
				console.log("菜单列表",res.result.data)
				context.commit('updateMenuList', res.result.data);
				resolve();
			  }).catch(e=>{
				reject(e)
			  })
		})
     
    },
	//当日餐饮订单
	 async getOrderDishesToday(context,hotel_id){
		
		  let w ={
			hotel_id:hotel_id,
			mealDate: new Date().Format("yyyy-MM-dd")
		  }
		  const res = await MenuService.getOrderDishesListByCondition(w);
		context.commit("updateOrderDishesToday",res.result.data)
		  return res;
		},
		//已下订的餐饮订单
		async getOrderDishesList(context,hotel_id) {
				const res = await MenuService.getOrderDishesList(hotel_id);
				console.log("orderdishes",res)
				context.commit("updateOrderDishesList",res.result.data);
				return res;		
		}

  }
}