<template>
	<view>
		<uni-forms ref="roomTypeRef" :modelValue="roomTypeForm" :rules="roomTypeRules" label-width="90px">
			<uni-forms-item label="房型名称" required name="name">
				<uni-easyinput v-model="roomTypeForm.name" placeholder="请输入房型名称" :disabled="type==2" />
			</uni-forms-item>
			<!-- <uni-forms-item label="房间数量" name="count">
                <view>
                  
                </view>
            </uni-forms-item> -->
			<uni-forms-item label="面积" name="area">
				<view style="display:flex;align-items:center">
					<uni-number-box v-model="roomTypeForm.area" :min="1" :max="200" :disabled="type==2">
					</uni-number-box>
					<text style="padding-left:8px">㎡</text>
				</view>
			</uni-forms-item>
			<uni-forms-item label="入住人数" name="count">
				<view>
					<uni-number-box v-model="roomTypeForm.guestNumber" :min="1" :disabled="type==2">
					</uni-number-box>
				</view>
			</uni-forms-item>
			<uni-forms-item label="床位" required>
				<!-- <uni-data-checkbox v-model="orderForm.roomTypeArray" mode="list"  multiple :localdata="roomTypeListFormat">1111</uni-data-checkbox> -->
				<view class="uni-list">
					<checkbox-group @change="bedCheckboxChange">
						<view :class="[this.type==2? 'disabled-style':'']" style="display: flex"
							v-for="(item, index) in bedTypeList" :key="item.name">
							<view>
								<checkbox :checked="item.checked" :disabled="type==2" :value="item.name" />
							</view>
							<view style="display: flex; flex: 1">{{item.name}}</view>
							<view><uni-number-box v-model="item.count" :min="1" :disabled="!item.checked||type==2" />
							</view>
						</view>
					</checkbox-group>
				</view>
			</uni-forms-item>
			<uni-forms-item label="价格" required>
				<view class="group">

					<uni-number-box :min="0" :max="9999" integer v-model="roomTypeForm.priceBase" :disabled="type==2"
					>				
					</uni-number-box>
				</view>
			</uni-forms-item>			
			<uni-forms-item label="屋内设施" required>
				<checkbox-group @change="facilityCheckboxChange">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="hm-facilityConfig"
						field="name" :getone="false" where="type=='roomType'" orderby="name asc">

						<view :class="[this.type==2? 'disabled-style':'', 'flex-center']"
							style="justify-content:start;flex-wrap:wrap; gap:20px">
							<view style="" v-for="(item, index) in data" :key="item.name">
								<checkbox :checked="roomTypeForm.facility&&roomTypeForm.facility.includes(item._id)"
									:disabled="type==2" :value="item._id" />{{item.name}}
							</view>
							<view style="height:0;width:50px" v-for="item in 5">
							</view>
						</view>
					</unicloud-db>
				</checkbox-group>
			</uni-forms-item>
			<view>
				<uni-forms-item label="封面图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef1" :cloudPath="cloudPath" @success="uploadSuccessFirst"
					:imagesList="roomTypeForm.firstImages? [roomTypeForm.firstImages]:[]" :max="1"
					:disabled="type==2"></xt-file-picker>
				<uni-forms-item label="房型图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef2" :cloudPath="cloudPath" @success="uploadSuccess"
					:imagesList="roomTypeForm.imagesList" :disabled="type==2"></xt-file-picker>

			</view>
		
			<view class="submit-btn-style">
			<view><button v-if="type!=2" type="default" class="submit-btn" :disabled="submitDisabled" :loading="submitLoading" @click="submitForm()" >保存</button></view>			
			</view>
			
		</uni-forms>

	</view>
</template>

<script>
import  {DB} from "../../../api/DB.js";
import XtFilePicker from '../../../components/xt-file-picker/xt-file-picker.vue';
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
import uniFormsItem from '../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue';
import UniListItem from '../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.vue';
import UniSection from '../../../uni_modules/uni-section/components/uni-section/uni-section.vue';
export default {
  components: { uniFormsItem, XtFilePicker, UniSection, UniListItem, LIcon },
		props:{
			type:0,
			rt:{}
		},
		data() {
			return {
				submitLoading: false,
				cloudPath:`/${this.$store.state.hotel_id}/roomType/`,
				roomTypeForm: {
                    "count": 1,
                    "name": "",
					"area":15,
					"isWindow":true,
					//"isBathtub":false,
					//"isBalcony":true,
					"guestNumber":2,
					"firstImages":"",
					"imagesList":[],
					//"disposableToiletries":true,
					"bedList":[],
                    "roomList":[],
					"facility":[],
					"priceBase_name":"",
					"priceA_name":"",
					"priceB_name":"",
					"priceBase":0,
					"priceA":0,
					"priceB":0,
					isBargain:true,
					bargainMinPercent:80
                
				},
				bedTypeList:[
					{name:"1.8米",checked:false,count:1},
					{name:"1.5米",checked:false,count:1},
					{name:"1.3米",checked:false,count:1},
					{name:"1.2米",checked:false,count:1}
				],
				roomTypeRules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入房型名称',
							},
							{
								validateFunction: (rule, value,data,callback)=> {	
									if(this.type==1){
										return true;
									}								
									let obj = this.roomType.find(item=>{ return item.name==value});
									// if(this.type!=1){
									// 	 obj = this.roomType.find(item=>{ return item.name==value && item._id !=this.rt._id});
									// }
									if(obj){
										callback('已存在相同房型名称')
									}
									return true;
								}
							}
						],
					},
					bedList:[{
								required: true,
								errorMessage: '请选择床位',
							}],
					roomList:[]
				}


			};
		},
		created() {
			if(this.type==undefined||this.type==0){
				return;
			}
			let obj = {
			    "count": this.rt.count,
			    "name": this.rt.name,
				"area":this.rt.area,
				//"isBathtub":this.rt.isBathtub,
				//"isBalcony":this.rt.isBalcony,
				"isWindow":this.rt.isWindow,
				"guestNumber":this.rt.guestNumber,
				"firstImages":this.rt.firstImages||"",
				"imagesList": this.rt.imagesList||[],
				//"disposableToiletries":this.rt.disposableToiletries,
				"bedList":this.rt.bedList,
			    "roomList":this.rt.roomList,
				"facility":this.rt.facility||[],
				"priceBase_name":this.rt.priceBase_name,
				"priceA_name":this.rt.priceA_name,
				"priceB_name":this.rt.priceB_name,
				"priceBase":this.rt.priceBase,
				"priceA":this.rt.priceA,
				"priceB":this.rt.priceB,
				isBargain:this.rt.isBargain,
				bargainMinPercent:this.rt.bargainMinPercent
			}
			
					this.roomTypeForm=JSON.parse(JSON.stringify(obj));
			
		},
		mounted(){
			//console.log(this.rt);
			//床位赋值
			if(this.roomTypeForm.bedList&&this.roomTypeForm.bedList.length){
				for(let i=0;i<this.bedTypeList.length;i++){
					let obj = this.roomTypeForm.bedList.find(it=>it.name ==this.bedTypeList[i].name );
					if(obj){
						this.bedTypeList[i].checked=true;
						this.bedTypeList[i].count=obj.count;
					}
				}
			}
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
			bedTypeListFomat(){
				let arr = this.bedTypeList.filter(item=>item.checked);
				return arr.map(item=>{
					return {name:item.name,count:item.count};
				})
			},
			validRoomList(){
				const arr = this.roomTypeForm.roomList;
				let obj = arr.find(item=>item.room_name=="");
				const nameArray = arr.map(item=>item.room_name);
				const nameArraySet = new Set(nameArray);
				return (obj||nameArraySet.size!=nameArray.length)?false:true;
			},         
			submitDisabled() {
				return false
			}
		},
		methods: {
			transformImageUrl(url){
					  return url.replace("https://env-00jxhfhjd231.normal.cloudstatic.cn","https://cdn.hotelsys.fun");
			},
			bargainMinPercentChange(e){
				this.roomTypeForm.bargainMinPercent=e.detail.value
			},
			isBargainChange(e){
      			let {value} = e.detail;
      			this.roomTypeForm.isBargain = value;
   				 },
			facilityCheckboxChange(e){
				this.roomTypeForm.facility = e.detail.value;
			},
			bedCheckboxChange(e){
			for(let i =0;i<this.bedTypeList.length;i++){
				this.bedTypeList[i].checked=e.detail.value.includes(this.bedTypeList[i].name)
			}			
			},
			radioEvent(key){
				this.roomTypeForm[key]=!this.roomTypeForm[key];
			},
			// isWindowEvent(){
			// 	this.roomTypeForm.isWindow=!this.roomTypeForm.isWindow;
			// },
			// isDisposableToiletries(){
			// 	this.roomTypeForm.disposableToiletries=!this.roomTypeForm.disposableToiletries;
			// },
			uploadSuccessFirst(list){
				this.roomTypeForm.firstImages=list[0];
			},
			uploadSuccess(list){
				this.roomTypeForm.imagesList=list;
			},
            roomTypeCountChange(val){
                
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
				if(this.bedTypeListFomat.length<1){
					uni.showToast({title:"请选择床位",icon:"none"});
					return;
				}
				if(!this.validRoomList){
					uni.showToast({title:"房间名无效或重复",icon:"none"});
					return;
				}
				this.roomTypeForm.hotel_id=this.hotel_id;
				this.roomTypeForm.bedList=this.bedTypeListFomat;
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
                            //console.log("添加成功");
                        await this.$store.dispatch("getRoomType");
                        this.$emit('closePopup');
						uni.hideLoading();
							
				}).catch(er => {
						//console.log("添加失败",er);
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
								_id:this.rt._id._value,
                                roomTypeObj:this.roomTypeForm
							}
						).then(async res=>{
                            //console.log("修改成功");
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
		},
		addRoomEvent(){
			let arr=this.roomTypeForm.roomList||[];			
			arr.push({index:Date.now(),room_name:this.getRoomName(arr)})
		},
		deleteRoomEvent(index){
			 this.roomTypeForm.roomList.splice(index,1);
			
			//this.roomTypeForm.roomList=this.roomTypeForm.roomList.splice(index,1);
		},
		getRoomName(arr){
			let targetArr=[...arr];
			let newName = `房间${arr.length+1}`;
			let ob = arr.find(item=>item.room_name==newName);
			if(!ob){
				return newName;
			}else{
				targetArr.push("");
				return this.getRoomName(targetArr)
			}
			
		},
		getRoolList(room_type_id){

		}
	}
}

</script>

<style lang="scss" scoped>
.room-area {
	.header {
		padding: 15px;
		display: flex;
		background: #f0f0f0;
		font-size: 13px;
		color: #565656;

		.btn {
			display: flex;
			color: #007aff;
		}
	}
}
.note{
	font-size: 12px;
	padding:15px;
	text-align: center;
	color: #a1a1a1;
}
.disabled-style {
	color: #a1a1a1;
}

.priceContainer {
	border: 1px solid #eee;
	padding: 8px;
	font-size: 14px;

	.price-list {
		.price-list-item {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;

			.group {
				min-width: 350px;
				display: flex;
				align-items: center;
			}

			.in {
				flex: 1;
				border: 1px solid #eee;
				padding: 4px 8px;
				font-size: 14px;
				color: #777777;
			}
		}
	}
}
</style>