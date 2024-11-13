
import{DB} from '../../api/DB'
import {OrderService} from '../../services/OrderService';

export default{
	state: { //存放状态
        orderListTodayAfter:[],//今天及以后的订单
		orderListByCheckInToday:[], //今天办理入住的订单
		orderListToday:[]//今天住宿订单

	},

	mutations: {
        updateOrderListTodayAfter(state,list=[]) {
			state.orderListTodayAfter = list;
		},
		updateOrderListByCheckInToday(state,list=[]){
			state.orderListByCheckInToday= list;
		},
		updateOrderListToday(state,list=[]){
			state.orderListToday=list;
		}

    },
    actions:{
        	//获取当天开始的订单
		 async getOrderListTodayAfter(context,hotel_id) {
			const res = await OrderService.getOrderListTodayAfter(hotel_id);
			console.log("获取当天开始的订单",res)
				context.commit("updateOrderListTodayAfter", res.result.data);
			return res;
		},
		//今日办理入住的客户
		async getOrderListByCheckInToday(context,hotel_id){
			const res = await OrderService.getOrderListByCheckIn(hotel_id,new Date());
			console.log("今日办理入住。。。。。",res);
			context.commit("updateOrderListByCheckInToday",res.result.data);
			return res;	
		  },
		  async getOrderListToday(context,hotel_id){						
			 const res = await OrderService.getOrderListToday(hotel_id);
			 console.log("今日订单",res);
				context.commit("updateOrderListToday",res.result.data);
			return res;
			
			}
    }
}
