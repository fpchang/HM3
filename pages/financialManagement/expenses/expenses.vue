<template>
	<view>		
			<view class="add-content-style">
			  <view class="left-panal">
				
			  </view>
			  <view class="control-panal">
				
				<!-- <navigator url="/pages/financialManagement/expenses/createExpenses/createExpenses" hover-class="navigator-hover">
				 -->
					<uv-icon
				  name="plus-circle-fill"
				  color="#000"
				  size="22"
				  label="创建单据"
				  labelPos="bottom"
				  labelSize="12px"
				  @click="createExpenses"
				></uv-icon>
				<!-- </navigator> -->
			
			  </view>
			</view>
			<view class="filter-area">
				<view style="flex:1"> 
					<uni-datetime-picker v-model="filter.dateRangeArray" rangeSeparator="/" type="daterange"
					return-type="timestamp"  :clear-icon="false" style="z-index: 9999;" />			
				</view>
				<view style="width:120px">
					<uni-data-select
					v-model="filter.type"
					placeholder="支出类型"
					collection="hm-incomeAndExpensesConfig"
					where="billType=='expenses'"
					field="text , name as value"
					orderby="name asc"
					
				  ></uni-data-select>
				</view>
			</view> 
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList"
						 :getone="false" :where="where_str"  orderby="ioeTime asc">
			<view class="info-area">
				<view class="item"> 
					<view><text>总计(元)</text></view>
					<view class="num-area"><text class="num">{{amountSum(data) }}</text></view>
				</view>
			  </view>
			  <block v-if="!data||!data.length">
				<noData  text_content="当前无收入数据"></noData>
			  </block>
			  <block v-if="data&&data.length">
			<uni-section class="mb-10" title="其它支出明细" sub-title="" type="line"></uni-section>
		  <scroll-view scroll-x="false" scroll-y="true" style="height: calc(100vh - 232px);">				 
						 <xt-panal-list :count="data.length">
							       <!-- #ifdef MP -->
				<view  v-for="(item, index) in data" slot="card{{index}}"> 
					<view class="list">
						<view class="list-item"><text>时间：</text><text>{{new Date(item.ioeTime).Format("yyyy/MM/dd")}}</text></view>
						<view class="list-item"><text>类型：</text><text>{{item.type[0].text}}</text></view>
						<view class="list-item"><text>金额：</text><text>{{item.amount}}</text></view>
						<view class="list-item"><text>备注：</text><text>{{item.mark}}</text></view>
					</view>
				  </view>
				  <!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<template v-for="(item,index) in data" v-slot:[`card${index}`]>
					<view class="list">
						<view class="list-item"><text>时间：</text><text>{{new Date(item.ioeTime).Format("yyyy/MM/dd")}}</text></view>
						<view class="list-item"><text>类型：</text><text>{{item.type[0].text}}</text></view>
						<view class="list-item"><text>金额：</text><text>{{item.amount}}</text></view>
						<view class="list-item"><text>备注：</text><text>{{item.mark}}</text></view>
					</view>
				
					</template>
					 <!-- #endif -->
							
							</xt-panal-list>	
			
			
		</scroll-view>
	</block>
	</unicloud-db>
	</view>
</template>

<script>
import { computed, ref,watch, getCurrentInstance } from "vue";
import {useStore} from 'vuex';
	export default {
		setup(){
			const store = useStore();
			let first =new Date(new Date().getFullYear(),new Date().getMonth(),1).getTime();
			let last =new Date(new Date().getFullYear(),new Date().getMonth()+1,1).getTime()-1;
			let filter =ref({
				type:"",
					dateRangeArray:[first,last]
				});
			let where_str =computed(()=>{
				const s1 =`billType=='expenses'`;
				const s2=`ioeTime>=${filter.value.dateRangeArray[0]}&&ioeTime<=${filter.value.dateRangeArray[1]}`
				//const s3=filter.value.type?`type=='${filter.value.type}'`:"type!=''";
				return `${s1}&&${s2}`
			});
			let colList=computed(()=>{
				let w = filter.value.type?{type:filter.value.type,hotel_id:store.state.hotel_id}:{hotel_id:store.state.hotel_id};
				const db = uniCloud.database();
				return [
                    db.collection("hm-incomeAndExpenses").where(w).getTemp(),
                    db.collection("hm-incomeAndExpensesConfig").getTemp()
			  ]
			});
			watch(filter, (newValue, oldValue) => {
				
				//this.$refs.udb.refresh();
   			 });
			return {
				filter,
				colList,
				where_str
			}
		},
		data() {
			return {
				
			}
		},
		onShow(){
			//this.$refs.udb.refresh();
		},
		methods:{
			amountSum(list){
				let sum =0;
				 list.map(item=>{
					sum+=item.amount
				 });
				 return sum;
			},
			createExpenses() {
      uni.navigateTo({
        url: "/pages/financialManagement/expenses/createExpenses/createExpenses",
        events: {
          updateData: () => {
            console.log("刷新数据");
            this.$refs.udb.refresh();
          },
        },
      });
    },
		}
	}
</script>

<style lang="scss" >
.add-content-style {
	height: 60px;
	display: flex;
	justify-content: flex-end;
	padding: 0 20px;
	box-sizing: border-box;
	background: #f7f7f7;
	.left-panal{
		flex: 1;
		display: flex;
		align-items: center
	};
	.control-panal {
	  display: flex;
	  padding: 10px 0px;
	  border-radius: 8px;
	  gap: 20px;
	}
  }
.filter-area{
	max-width: 600px;
	height: 60px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding:0 15px;
}
.info-area {
  color: #6a6a6a;
  font-size: 12px;
  display: flex;
  align-items: center;
  display: flex;
  padding:0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  max-width: 600px;
  .item{
	background-color: #ccac02;
	border-radius: 10px;
	width: 110px;
	height: 70px;
	box-sizing: border-box;
	padding:8px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
  color: #fff;
	.num-area{
		text-align: center;
		.num{
			color:#FFF;
			padding:0 4px;
			font-weight: bold;
			font-size: 20px;
		  }
	}
  }
  
}
.list {
  color: #6a6a6a;
  font-size: 13px;
  padding:4px;
  .list-item {
    box-sizing: border-box;
    padding: 6px 15px;
    display: flex;
    align-items: center;
  }
}
</style>
