<template>
	<view>
		<uni-forms ref="hotelFormRef" :modelValue="hotelForm" :rules="hotelFormRules">

			<uni-forms-item label="酒店名" required name="hotelName">
				<uni-easyinput v-model="hotelForm.hotelName" placeholder="请输入酒店名称" :disabled="type==2"/>
			</uni-forms-item>
			<uni-forms-item label="酒店地址" name="hotelAdress">
				<uni-easyinput v-model="hotelForm.hotelAdress" placeholder="请输入酒店地址" :disabled="type==2"/>
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="hotelForm.hotelIntroduction" placeholder="备注内容" :disabled="type==2"></uni-easyinput>

			</uni-forms-item>
			<view>
				<uni-forms-item label="封面图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef1" :cloudPath="cloudPath" @success="uploadSuccessFirst" :imagesList="hotelForm.firstImages?[hotelForm.firstImages]:[]" max="1" :disabled="type==2"></xt-file-picker>
				<uni-forms-item label="酒店图片" ></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef2" :cloudPath="cloudPath" @success="uploadSuccess" :imagesList="hotelForm.imagesList" :disabled="type==2"></xt-file-picker>
				
			</view>
			<uni-forms-item>
				<uv-button v-if="type!=2" type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
					:loading="submitLoading"></uv-button>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
	//import  {DB} from "../../../api/DB";
	import  {HotelService} from "../../../services/HotelService";
	export default {
		props:{
			type:0,
			targetObj:{}
		},
		data() {
			return {
				submitLoading: false,
				cloudPath:`/${this.$store.state.hotel_id}/hotel/`,
				hotelForm: this.type!=0?{
					belong: this.targetObj.belong,
					hotelName: this.targetObj.hotelName,
					hotelAdress: this.targetObj.hotelAdress,
					hotelCoordinate: this.targetObj.hotelCoordinate,
					hotelIntroduction: this.targetObj.hotelIntroduction,
					"firstImages":this.targetObj.firstImages||"",
					"imagesList": this.targetObj.imagesList||[],
				}: {
					belong: "",
					hotelName: "",
					hotelAdress: "",
					hotelCoordinate: [],
					hotelIntroduction: "",
					"firstImages":"",
					"imagesList":[],
				},
				hotelFormRules: {
					// 对name字段进行必填验证
					hotelName: {
						rules: [{
								required: true,
								errorMessage: '请输入酒店名',
							},
							{
								validateFunction: (rule, value,data,callback)=> {									
									let obj = this.hotelList.find(item=>{ return item.hotelName==value});
									if(obj&&this.type==0){
										callback('已存在酒店名')
									}
									return true;
								}
							}
						],
					}
				}


			};
		},
		created() {
			console.log("target",this.targetObj)
		},
		computed: {
			user(){
				return this.$store.state.user
			},
			hotelList(){
				return this.$store.state.hotelList;
			},
			submitDisabled() {
				return false
			}
		},
		methods: {
			uploadSuccessFirst(list){
				this.hotelForm.firstImages=list[0];
			},
			uploadSuccess(list){
				console.log("list");
				this.hotelForm.imagesList=list;
			},
			submitForm() {
				if(this.$refs.uploadImagesRef1.uploadingState()==0||this.$refs.uploadImagesRef2.uploadingState()==0){
					uni.showToast({title:"有图片正在上传中，请稍候...",icon:"error"});
					return;
				}
				if(this.$refs.uploadImagesRef1.uploadingState()==2||this.$refs.uploadImagesRef2.uploadingState()==2){
					uni.showToast({title:"有图片上传失败，请重新上传或取消",icon:"error"});
					return;
				}
				this.$refs.hotelFormRef.validate().then(res => {
					//uni.showLoading();
					this.submitLoading = true;
					if(this.type==1){
						this.updateHotel();
						return ;
					}
					this.addHotel();

				
				});


			},
			addHotel(){
				this.hotelForm.belong=this.user.phone;
					HotelService.createHotel(this.hotelForm).then(async res => {
						console.log("添加成功");
						uni.hideLoading();
						this.submitLoading = false;
						// uni.reLaunch({
						// 	url:"/pages/index/index"
						// })
						await this.$store.dispatch("getHotelList");
						this.$emit('closePopup');
					}).catch(er => {
						console.log("添加失败",er);						
						uni.hideLoading();
						uni.showToast({
							title: '数据异常，请稍候再试',
							icon: 'error'
						})
						this.submitLoading = false;
					})
			},
			async updateHotel(){
				console.log(this.targetObj)
				try {
					await HotelService.updateHotel(this.targetObj._id,this.hotelForm);
					await this.$store.dispatch("getHotelList");
					this.$emit('closePopup');
				} catch (error) {
					console.error(error);
					uni.hideLoading();
						uni.showToast({
							title: '更新失败，请稍候再试',
							icon: 'error'
						})
						this.submitLoading = false;
				}
				
			}
		},
	};
</script>

<style lang="scss">
	.uni-list-cell {
		justify-content: flex-start
	}

	.disabled-style {
		color: #bbb;
	}
</style>