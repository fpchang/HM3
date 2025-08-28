<script>
	// "tabBar": {
	// 	"height": "0",
	// 	"color": "#1d1d1f",
	// 	"selectedColor": "#0765ae",
	// 	"borderStyle": "black",
	// 	"backgroundColor": "#ffffff",
	// 	"list": [
	// 		{
	// 			"index":0,
	// 			"pagePath": "pages_client/client_index/client_index",
	// 			"iconPath": "static/img/home-black.png",
	// 			"selectedIconPath": "static/img/home-blue.png",
	// 			"text": "首页",
	// 			"visible": true
	// 		},
	// 		{
	// 			"index":1,
	// 			"pagePath": "pages/home/home",
	// 			"iconPath": "static/img/home-black.png",
	// 			"selectedIconPath": "static/img/home-blue.png",
	// 			"text": "首页",
	// 			"visible": true
	// 		},
	// 		{
	// 			"index":2,
	// 			"pagePath": "pages/mine/mine",
	// 			"iconPath": "static/img/mine-black.png",
	// 			"selectedIconPath": "static/img/mine-blue.png",
	// 			"text": "我的",
	// 			"visible": true
	// 		}
	// 	]
	// },
	export default {
		onLaunch: async function(ob) {
			 console.log("参数信息",ob)
			// console.log('App Launch XXXXXXXXXX',uni.getSystemInfoSync());	
				// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen();//关闭启动图
				// #endif
				   // #ifdef MP
				   console.log("MPPPPP")
     this.$store.commit("setTopHeight","70px");
   // #endif
    // #ifndef MP
	 console.log("!!!MPPPPP")
     this.$store.commit("setTopHeight","60px");
   // #endif
			this.getEnv();
			this.initData();
			
			//this.$isResolve();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{

			 initData(){
				const sys =uni.getSystemInfoSync(); 
				let flag  = sys['deviceType']=='pc' ||sys['windowWidth']>1000; 
				// #ifdef MP-WEIXIN ||APP-PLUS
				flag = sys['deviceType']=='pc' ||uni.getWindowInfo().windowWidth>1000; 
				// #endif
				const config = uni.getStorageSync("config");
				config&&this.$store.commit("setConfig",config);
				this.$store.commit("setPcShow",flag);					
				this.$store.commit("updateUser");
				this.$store.dispatch("initViewWidth");
				this.$store.commit("setUser", uni.getStorageSync("user"));
				
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
