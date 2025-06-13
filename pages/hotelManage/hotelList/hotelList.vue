<template>

	<view class="hotel-component">
		<view class="add-content-style">
			<view class="control-panal">
			<uv-icon
			   name="plus-circle-fill"
			   color="#000"
			   size="22"
			   label="添加酒店"
			   labelPos="bottom"
			   labelSize="12px"
			   @click="addHotel"
			 ></uv-icon>
		   </view>
		   </view>
		<view v-if="false&&isPcShow">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="120px">酒店名称</uni-th>
					<uni-th align="center" >地址</uni-th>
					<uni-th align="center" width="120px">店主</uni-th>
					<uni-th align="center" width="120px">角色</uni-th>
					<uni-th align="center" width="180px">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item of hotelList">
					<uni-td>{{item.hotelName}}</uni-td>
					<uni-td>{{item.hotelAddress}}</uni-td>
					<uni-td>{{item.belong}}</uni-td>
					<uni-td>{{roleFormat(item.curRole)}}</uni-td>
					<uni-td align="center">
						<view class="uni-group" style="justify-content:space-around">
						  <text v-if="item.curRole=='administrator'" class="edit-text-btn-style" @click="editHotel(item)">修改</text>
            			  <text v-if="item.curRole=='administrator'" class="edit-text-btn-style" @click="deleteHotel(item)">删除</text>
						</view>
					</uni-td>
				</uni-tr>


			</uni-table>
		</view>
		  <block v-if="noData">
      <noData
        text_content="您还没有酒店"
        :showControl="true"
        text_control_add="创建一个"
        @Event_one="addNewHotel"
      ></noData>
    </block>
		<block  v-if="!noData">

		
		<view class="mobile-show-style">
			<xt-panal-list :count="hotelList.length">
				
				<!-- #ifdef MP -->
				<view v-for="(item,index) of hotelList" slot="card{{index}}">
					<xt-panal-card :logoUrl="item.firstImages" :title="item.hotelName" :control_edit="item.curRole=='administrator'" :control_delete="item.curRole=='administrator'"  @edit_event="editHotel(item)" @delete_event="deleteHotel(item)" @view_event="viewDetail(item)">
							 <view slot=titleContent>
								<view class="titleContent"> 
									<view class="titleContent-item">{{ `【店主：${item.belong}】` }}</view>
									<view class="titleContent-item">{{ `【角色：${this.roleFormat(item.curRole)}】` }}</view>
									
								</view>
								
						   	</view>
						</xt-panal-card>
				  </view>
				<!-- #endif -->
				  <!-- #ifdef H5 || APP-PLUS -->
				   <template v-for="(item,index) of hotelList" v-slot:[`card${index}`]>
					   <xt-panal-card :logoUrl="item.firstImages" :title="item.hotelName" :control_edit="item.curRole=='administrator'" :control_delete="item.curRole=='administrator'" @edit_event="editHotel(item)" @delete_event="deleteHotel(item)" @view_event="viewDetail(item)" >
							   <template v-slot:titleContent>
								<view class="titleContent"> 
									<view class="titleContent-item">{{ `【店主：${item.belong}】` }}</view>
									<view class="titleContent-item">{{ `【角色：${this.roleFormat(item.curRole)}】` }}</view>
								</view>
								<view style="padding:10px 0"></view>
							   </template>
					
						   </xt-panal-card>
					   </template>
				 <!-- #endif -->
			  
				  
		  </xt-panal-list>
			<!-- <uni-collapse v-model="accordionVal">
				<uni-collapse-item v-for="item of hotelList">
					<template v-slot:title>
						<uni-section class="mb-10" :title=" item.hotelName " type="circle">
				
						</uni-section>
					</template>
					<view class="col-content">
						<view class="list">
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">地址：</text><text>{{item.hotelAddress}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">店主：</text><text>{{item.belong}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">角色：</text><text>{{roleFormat(item.curRole)}}</text></view>
							</view>
							<view class="list-item" style="justify-content: flex-end;">

								<view class="list-item-c" style="width: 150px;">
							<button
							v-if="item.curRole=='administrator'"
                    class="uni-button"
                    size="mini"
                    type="primary"
                    @click="editHotel(item)"
                  >
                    修改
                  </button>
                  <button
				  v-if="item.curRole=='administrator'"
                    class="uni-button"
                    size="mini"
                    type="warn"
                    @click="deleteHotel(item)"
                    :loading="submitLoading"
                  >
                    删除
                  </button>
								</view>
							</view>
						</view>

					</view>
				</uni-collapse-item>

			</uni-collapse> -->
		</view>
		</block>
		<uni-popup ref="popupaddHotel" background-color="transprant" @change="popupChange">
			<view class="popup-content">
				<view class="create-order-title-style">{{["新增酒店","修改酒店信息","酒店详情"][type]}}</view>
				<view class="comContent">
					<createHotelComponent  @closePopup="closePopup" :type="type" :targetObj="targetObj"></createHotelComponent>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
import createHotelComponent from '../components/createHotelComponent';
import  {HotelService} from "../../../services/HotelService";
import  {DB} from '../../../api/DB';
import {alert} from "@/alert";
	export default {
		components:{
			createHotelComponent
		},
		data() {
			return {
				type:0,
				targetObj:{},
				submitLoading: false,
				accordionVal: '0',
				showPopup:false,
				
			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			hotel_id(){
				return this.$store.state.hotel_id
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			noData(){
				return !this.hotelList||this.hotelList.length<1;
			}
		},
		async created() {
			console.log("hotellist is created");
			uni.hideLoading();
		},
		watch:{
			hotel_id(){
				// this.$store.dispatch("getRoomType");
			},
			  async partialRefreshComName(val){
				//下拉刷新
				if(val=='hotelList'){
					console.log("局部刷新 employeeComponent")
					await this.$store.dispatch("getHotelList");
        			console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
  
		},
		methods:{
			getSubtitle(item){
				let str="";
				return `【店主：${item.belong}】【角色：${this.roleFormat(item.curRole)}】`
			
			},
			roleFormat(val){
				const p= {
					administrator:"超级管理员",
					manager:"管理员",
					normal:"员工"
				}
				return p[val]
			},
			editHotel(targetObj){
				if(targetObj.curRole!="administrator"){
					alert.alertNoPermisson();
					return;
				}
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_UPDATE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				this.type=1;
				this.targetObj =JSON.parse(JSON.stringify(targetObj));
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}
					
				
				uni.navigateTo({
					url:`/pages/hotelManage/createHotel/createHotel?type=${this.type}&&targetObj=${encodeURIComponent(JSON.stringify(this.targetObj))}`
				})
			},
			addHotel(){
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_CREATE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				this.type=0;
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}									
				uni.navigateTo({
					url:'/pages/hotelManage/createHotel/createHotel'
				})
			},
			async deleteHotel(targetObj){
				if(targetObj.curRole!="administrator"){
					alert.alertNoPermisson();
					return;
				}
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_DELETE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				const conf = await uni.showModal({
					title: '确认删除此酒店',
					content: '删除后将无法恢复,确认删除吗?',
					cancelText: '取消',
					confirmText: '确认'
				})
				if (conf['cancel']) {
					return;
				}
				this.submitLoading = true;
				HotelService.deleteHotel(targetObj._id).then(async res=>{
                            console.log("删除成功");
						await this.$store.dispatch("getHotelList");
						this.submitLoading = false;
						uni.hideLoading();
						if(!this.hotelList||this.hotelList.length<1){
							  uni.reLaunch({url: "/pages/index/index"});
						}
							
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
			viewDetail(targetObj){
				this.type=2;
				this.targetObj =JSON.parse(JSON.stringify(targetObj));
				console.log(this.targetObj)
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}
					
				
				uni.navigateTo({
					url:`/pages/hotelManage/createHotel/createHotel?type=${this.type}&&targetObj=${encodeURIComponent(JSON.stringify(this.targetObj))}`
				})
			},
			popupChange(e){
				this.showPopup=e.show;
			},
			closePopup(){
				this.$refs.popupaddHotel.close();
			}
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
	.titleContent{
		font-size: 13px;
		.titleContent-item{
			padding:3px 0;
		}
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
				font-size:$uni-font-size-base ;
				.list-item-c {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.stitle{
						font-weight: bold;
						
					}
				}
			}
		}
	}
</style>