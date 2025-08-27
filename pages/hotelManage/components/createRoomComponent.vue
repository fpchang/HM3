<template>
    <view>
        <uni-forms ref="roomTypeRef" :modelValue="roomForm" :rules="roomTypeRules" label-width="90px">
            <uni-forms-item label="房型名称" required name="name">
                <uni-easyinput v-model="roomForm.name" placeholder="请输入房间名称" />
            </uni-forms-item>
		<view>
			<uv-button type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
            :loading="submitLoading"></uv-button>
		</view>
        </uni-forms>
        
    </view>
</template>

<script>
import  {DB} from "../../../api/DB.js";
export default {
  components: {},
		props:{
			rm:{
				name:""
			}
		},
		data() {
			return {
				submitLoading: false,
				cloudPath:`/${this.$store.state.hotel_id}/roomType/`,
				roomList:[],
				roomForm: {
                    "name": ""
                
				},

				roomTypeRules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入房间名称',
							},
							{
								validateFunction: (rule, value,data,callback)=> {									
									let obj = this.roomList.find(item=>{ return item.name==value});
										if(obj){
										callback('已存在相同房型名称')
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
			
		},
		mounted(){
			
		},
		computed: {
			hotel_id(){
				return this.$store.state.hotel_id;
			},
			hotelList(){
				return this.$store.state.hotelList;
			},      
			submitDisabled() {
				return false
			}
		},
		methods: {
			getRoomList(){},
			submitForm() {
				this.roomForm.hotel_id=this.hotel_id;
				this.roomForm.room_type_id = this.room_type_id
				this.$refs.roomTypeRef.validate().then(res => {
					//uni.showLoading();
					this.submitLoading = true;           				
					this.addRoomType();

			})
		},
		addRoomType(){
			DB.callFunction(
							"hm_addRoomType",
							{
                                roomTypeObj:this.roomForm
							}
						).then(async res=>{
                            console.log("添加成功");
                        await this.getRoomList();
						uni.hideLoading();
							
				}).catch(er => {
						console.log("添加失败",er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content:"系统异常，请稍候再试！",
							confirmText:"确认"
						});
					})
		},
		updateRoom(){
			console.log("修改。。。",this.roomForm)
			DB.callFunction(
							"hm_updateRoom",
							{
								_id:this.rm._id,
                                roomTypeObj:this.roomForm
							}
						).then(async res=>{
                            console.log("修改成功");
							 await this.getRoomList();

						uni.hideLoading();
							
				}).catch(er => {
						console.log("修改失败",er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content:"系统异常，请稍候再试！",
							confirmText:"确认"
						});
					})
		}
	}
}

</script>

<style lang="scss" scoped>
.disabled-style {
	color: #a1a1a1;
}
.priceContainer{
	border:1px solid #eee;padding:8px;
	font-size: 14px;
	.price-list{
		.price-list-item{
			display:flex;
			flex-wrap: wrap;
			gap:10px;		
			.group{
				min-width: 350px;
				display: flex;
				align-items:center;
			}
			.in{
				flex: 1;
				border:1px solid #eee;padding:4px 8px;
				font-size: 14px;
				color: #777777;
			}
		}
	}
}
</style>