<template>

	<view class="roomType-component">
		<view class="add-content-style">
			<view class="control-panal">			
			 <uv-icon
			   name="plus-circle-fill"
			   color="#000"
			   size="22"
			   label="添加房型"
			   labelPos="bottom"
			   labelSize="12px"
			   @click="addRoomType"
			 ></uv-icon>
		   </view>
		   </view>
			  <block v-if="noData">
      <noData
        text_content="没有数据"
        :showControl="true"
        text_control_add="添加房型"
        @Event_one="addRoomType"
      ></noData>
    </block>
		<block  v-if="!noData">
		<view class="mobile-show-style">
			<xt-panal-list :count="roomType.length">
				
				  <!-- #ifdef MP -->
				  <view v-for="(item,index) of roomType" slot="card{{index}}">
					  <xt-panal-card :logoUrl="item.firstImages" :title="item.name"  @edit_event="editRoomType(item)" @delete_event="deleteRoomType(item)" @view_event="viewDetail(item)" :subtitle="getSubtitle(item)">
					  		 <view slot=titleRight>
					  			<!-- <uni-badge class="uni-badge-left-margin" :text="item.count" /> -->
								  <text style="font-size:13px">{{item.count}} 间</text>
							 </view>
					  	</xt-panal-card>
					</view>
				  <!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					 <template v-for="(item,index) of roomType" v-slot:[`card${index}`]>
						 <xt-panal-card :logoUrl="item.firstImages" :title="item.name"  @edit_event="editRoomType(item)" @delete_event="deleteRoomType(item)" @view_event="viewDetail(item)" :subtitle="getSubtitle(item)">
						 		<template v-slot:titleRight>
						 			<!-- <uni-badge class="uni-badge-left-margin" :text="item.count" /> -->
									  <text style="font-size:13px">{{item.count}} 间</text>
						 		</template>
						 	</xt-panal-card>
						 </template>
				   <!-- #endif -->
				
					
			</xt-panal-list>
			<!-- <uni-collapse v-model="accordionVal" accordion>
				<uni-collapse-item v-for="item of roomType">
					<template v-slot:title>
						<uni-section class="mb-10" :title=" item.name " type="circle">
							<template v-slot:right>
								<text style="font-weight: bold;">{{item.count}}间</text>
								
							</template>
						</uni-section>
					</template>
					 <view class="col-content">
						<view class="list">
							<view class="list-item">
								<view class="list-item-c">
									<view style="width:80px;"><text class="stitle">房间号：</text></view>
									<view style="flex:1"><text v-for="i of sortRoomList(item.roomList)">【{{i}}】</text></view>
								
								</view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">数量：</text><text>{{item.count}}</text></view>
							</view>
							<view class="list-item" style="justify-content: flex-end;">

								<view class="list-item-c" style="width: 150px;">
									<button class="uni-button" size="mini" type="primary"
										@click="editRoomType(item)">修改</button>
									<button class="uni-button" size="mini" type="warn"
										@click="deleteRoomType(item)" :loading="submitLoading">删除</button>
								</view>
							</view>
							<view  class="list-item">								
								<xt-file-picker  :disabled="true" :key="new Date().getTime()"  :imagesList="item.imagesList"></xt-file-picker>
							</view>
						</view>

					</view>
				</uni-collapse-item>

			</uni-collapse> -->
		</view>
		</block>
		<uni-popup ref="popupCreateRoomType" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">{{type==1?"修改房型":"创建房型"}}</view>
				<view class="comContent">					
					 <createRoomTypeComponent @closePopup="closePopup" :type="type" :rt="rt"></createRoomTypeComponent> 				
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupRoomTypeImages" background-color="transprant">
			<view class="popup-content" >
				<view class="create-order-title-style">房型图片</view>
				<view class="comContent">					
					 <roomTypeImagesComponent @closePopup="closePopup" :type="type" :rt="rt"></roomTypeImagesComponent> 				
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import createRoomTypeComponent from './createRoomTypeComponent';
import {alert} from "@/alert";
import  {DB} from '../../../api/DB';
	export default {
		components:{
			createRoomTypeComponent
		},
		data() {
			return {
				type:0,
				rt:{},
				submitLoading: false,
				accordionVal: null,
				
			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			hotel_id(){
				return this.$store.state.hotel_id
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			roomType() {
				return this.$store.state.roomType;
			},
			showAddBtn(){
				return this.$store.state.permissionStore.permissionList.includes('ROOMTYPE_CREATE');
			},
			noData(){
				return !this.roomType||this.roomType.length<1;
			}
		},
		async created() {
			await  this.$store.dispatch("getRoomType");
			uni.hideLoading();
			
		},
		watch:{
			hotel_id(val,oldVal){
				if(val!=oldVal){
				 this.$store.dispatch("getRoomType");
				}
			},
			async partialRefreshComName(val){
				//下拉刷新
				console.log(val)
				if(val=='roomTypeListComponent'){
					console.log("局部刷新 roomTypeListComponent")
					await this.$store.dispatch("getRoomType");
					console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
		},
		methods:{
			getSubtitle(item){
				let bedList = item.bedList;
				let str="";
				bedList&&bedList.map(item=>{
					let s= item.count>1?`*${item.count}`:""
					str+=`${item.name}床${s}、`;
				})
				str = str.substring(0, str.length - 1);
				return `【${str}】【${item.guestNumber||2}人】【${item.area||'--'}㎡】`
				
			},
			sortRoomList(list){
				let newList = list.filter(item=>{return item})
				return newList.sort();
			},
			editRoomType(rt){
				if(!this.$store.state.permissionStore.permissionList.includes('ROOMTYPE_UPDATE')){
					 alert.alertNoPermisson();
					return;
				}
				this.type=1;
				this.rt =rt;
				if(this.$store.state.isPcShow){
					this.$refs.popupCreateRoomType.open();
					return;
				}
				uni.navigateTo({
					url:`/pages/hotelManage/createRoomType/createRoomType?type=${this.type}&&rt=${encodeURIComponent(JSON.stringify(this.rt))}`
				})
			},
			addRoomType(){
				console.log(this.$store.state.permissionStore.permissionList)
				if(!this.$store.state.permissionStore.permissionList.includes('ROOMTYPE_CREATE')){
					 alert.alertNoPermisson();
					return;
				}
				this.type=0;
				if(this.$store.state.isPcShow){
					this.$refs.popupCreateRoomType.open();
					return;
				}
					
				
				uni.navigateTo({
					url:'/pages/hotelManage/createRoomType/createRoomType'
				})
			},
			async deleteRoomType(rt){
				if(this.submitLoading){
					return;
				}
				if(!this.$store.state.permissionStore.permissionList.includes('ROOMTYPE_DELETE')){
					 alert.alertNoPermisson();
					return;
				}
				const conf = await uni.showModal({
					title: '确认删除房型',
					content: '删除后将无法恢复,确认删除吗?',
					cancelText: '取消',
					confirmText: '确认'
				})
				if (conf['cancel']) {
					return;
				}
				this.submitLoading = true;
				//uni.showLoading();
				DB.callFunction("hm_deleteRoomType",
					{
						_id:rt._id
					}
				).then(async res=>{
                            console.log("删除成功");
							await this.$store.dispatch("getRoomType");
						this.submitLoading = false;
						uni.hideLoading();
							
				}).catch(er => {
						console.log("删除失败",er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content:"系统异常，请稍候再试！",
							confirmText:"确认"
						});
					})
				
			},
			viewDetail(rt){
				this.type=2;
				this.rt =rt;
				if(this.$store.state.isPcShow){
					this.$refs.popupCreateRoomType.open();
					return;
				}
				uni.navigateTo({
					url:`/pages/hotelManage/createRoomType/createRoomType?type=${this.type}&&rt=${encodeURIComponent(JSON.stringify(this.rt))}`
				})
			},
			showRoomTypeImages(){
				this.$refs.popupRoomTypeImages.open();
			},
			closePopup(){
				this.$refs.popupCreateRoomType.close();
				this.$refs.popupRoomTypeImages.close();
				
			}
			// getRoomTypeList(){
			// 	return uniCloud.callFunction({
			// 		name:"hm_getRoomType",
			// 		data:{hotel_id:this.hotel_id}
			// 	}).then(res=>{
					
			// 		if(res.result.data.length){
			// 			this.$store.commit("updateRoomTypeList",res.result.data[0].roomTypeList);
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.add-content-style{
		display: flex;justify-content: flex-end;padding:0 20px;box-sizing: border-box;
	}
	.uni-group {
		display: flex;
		justify-content: space-between;
	}

	.col-content {
		/* background: linear-gradient(to bottom, #FFF, #EEF); */
		border-radius: 4px;
		padding: 0 20px;

		.list {
			display: flex;
			flex-direction: column;

			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 10px 0;

				.list-item-c {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.stitle{
						font-weight: bold;
						font-size: $uni-font-size-base;
					}
				}
			}
		}
	}
</style>