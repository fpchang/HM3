<script>
import {AccountService} from "./services/AccountService";
	export default {
		onLaunch: async function(ob) {
			console.log("参数信息",ob)
			console.log('App Launch XXXXXXXXXX',uni.getSystemInfoSync());
			// console.log("111",uni.getSystemInfoSync().deviceType)
			// console.log("222",uni.getDeviceInfo().deviceType)
			// try {
			// 	let {hotel_id} = ob.query;
			// if(hotel_id){
			// 	this.$store.commit("checkHotel",hotel_id);
			// }
			// } catch (error) {
				
			// }
		
			this.getEnv();
			this.initData();
			this.setConfig();
			
		},
		onShow: function() {
			console.log('App Show');
			this.initData();
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			async setConfig(){
				try {
					const res = await AccountService.getConfig();
					this.$store.commit("setConfig",res.result)
				} catch (error) {
					console.error(error)
				}
			},
			 initData(){
				const sys =uni.getSystemInfoSync(); 
				let flag  = sys['deviceType']=='pc' ||sys['windowWidth']>740; 
				// #ifdef MP-WEIXIN ||APP-PLUS
				flag = sys['deviceType']=='pc' ||uni.getWindowInfo().windowWidth>740; 
				// #endif
				this.$store.commit("setPcShow",flag);					
				this.$store.commit("updateUser");
				this.$store.dispatch("initViewWidth");
				
				
			},
			getEnv(){
				if (process.env.NODE_ENV === 'development') {
				this.globalData.env="development"
				} else {
					console.log('生产环境');
					this.globalData.env="product"
					}
			}
		},
		globalData:{
			systemInfo:uni.getSystemInfoSync(),
			appId:"",
			env:"development",
			secret:"****"
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
