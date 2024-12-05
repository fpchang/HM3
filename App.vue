<script>

	export default {
		onLaunch: async function(ob) {
			console.log("参数信息",ob)
			console.log('App Launch XXXXXXXXXX',uni.getSystemInfoSync());		
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
