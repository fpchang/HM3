<template>
    <view>
        <uni-forms ref="roomTypeRef" :modelValue="roomTypeForm" :rules="roomTypeRules" label-width="90px">

            <uni-forms-item label="房型名称" required name="name">
                <uni-easyinput v-model="roomTypeForm.name" placeholder="请输入房型名称" />
            </uni-forms-item>
            <uni-forms-item label="房型数量" name="count">
                <view>
                    <uv-number-box :min="1" integer v-model="roomTypeForm.count">
                        <input slot="input" style="width: 100px;text-align: center;" class="input"
                            v-model="roomTypeForm.count"></input>
                    </uv-number-box>
                </view>
            </uni-forms-item>
			<view>
				<uni-forms-item label="封面图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef" :cloudPath="cloudPath" @success="uploadSuccessFirst" :imagesList="[roomTypeForm.imagesFirst]" max="1"></xt-file-picker>
				<uni-forms-item label="房型图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef" :cloudPath="cloudPath" @success="uploadSuccess" :imagesList="roomTypeForm.imagesList"></xt-file-picker>
				
			</view>
		<view>
			<uv-button type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
            :loading="submitLoading"></uv-button>
		</view>
        </uni-forms>
        
    </view>
</template>

<script>
import  {DB} from "../../../api/DB.js";
import XtFilePicker from '../../../components/xt-file-picker/xt-file-picker.vue.jsx';
import uniFormsItem from '../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue.jsx';
import UniSection from '../../../uni_modules/uni-section/components/uni-section/uni-section.vue.jsx';
export default {
  components: { uniFormsItem, XtFilePicker, UniSection },
		props:{
			type:0,
			rt:{}
		},
		data() {
			return {
				submitLoading: false,
				cloudPath:`/roomType/${this.$store.state.hotel_id}/`,
				//hotelList:getApp().globalData.hotelList,
				roomTypeForm: this.type==1?{
                    "count": this.rt.count,
                    "name": this.rt.name,
					"imagesList": this.rt.imagesList,
                    "roomList":this.rt.roomList
				}: {
                    "count": 1,
                    "name": "",
					"imagesList":[],
                    "roomList":[]
                
				},
				roomTypeRules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入房型名称',
							},
							{
								validateFunction: (rule, value,data,callback)=> {									
									let obj = this.roomType.find(item=>{ return item.name==value});
									if(this.type==1){
										 obj = this.roomType.find(item=>{ return item.name==value && item._id !=this.rt._id});
									}
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
			console.log(this.roomTypeForm)
		},
		computed: {
			hotel_id(){
				return this.$store.state.hotel_id;
			},
			hotelList(){
				return this.$store.state.hotelList;
			},
            roomType() {
				return this.$store.state.roomType;
			},          
			submitDisabled() {
				return false
			}
		},
		methods: {
			uploadSuccess(list){
				console.log("list");
				this.roomTypeForm.imagesList=list;
			},
            roomTypeCountChange(val){
                console.log(val)
            },
			submitForm() {
				if(this.$refs.uploadImagesRef.isUploading()){
					uni.showToast({title:"有图片正在上传中，请稍候...",icon:"error"});
					return;
				}
				this.roomTypeForm.hotel_id=this.hotel_id;
				this.$refs.roomTypeRef.validate().then(res => {
					//uni.showLoading();
					this.submitLoading = true;
            
					if(this.type==1){
						this.updateRoomType();
						return ;
					}
					this.addRoomType();

			})
		},
		addRoomType(){
			DB.callFunction(
							"hm_addRoomType",
							{
                                roomTypeObj:this.roomTypeForm
							}
						).then(async res=>{
                            console.log("添加成功");
                        await this.$store.dispatch("getRoomType");
                        this.$emit('closePopup');
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
		updateRoomType(){
			DB.callFunction(
							"hm_updateRoomType",
							{
								_id:this.rt._id,
                                roomTypeObj:this.roomTypeForm
							}
						).then(async res=>{
                            console.log("修改成功");
							await this.$store.dispatch("getRoomType");
                        this.$emit('closePopup');
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

<style></style>