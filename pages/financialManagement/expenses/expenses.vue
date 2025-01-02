<template>
	<view>		
			<view class="add-content-style">
			  <view class="left-panal">
				<uni-data-checkbox
				  v-model="tabRadioVal"
				  :localdata="tabitems"
				></uni-data-checkbox>
			  </view>
			  <view class="control-panal">
				
				<navigator url="/pages/financialManagement/expenses/createExpenses/createExpenses" hover-class="navigator-hover">
					<uv-icon
				  name="plus-circle-fill"
				  color="#000"
				  size="22"
				  label="创建单据"
				  labelPos="bottom"
				  labelSize="12px"
				  @click="createIncome"
				></uv-icon>
				</navigator>
			
			  </view>
			</view>
			<view class="filter-area">
				<view style="flex:1"> 
					<uni-datetime-picker v-model="filter.dateRangeArray" rangeSeparator="/" type="daterange"
					return-type="timestamp" @change="dateConfim" :clear-icon="false" style="z-index: 9999;" />			
				</view>
				<view style="width:120px">
					<unicloud-db ref="udbconfig" v-slot:default="{data, loading, error, options}" collection="hm-incomeAndExpensesConfig"
					:getone="false" where="billType=='expenses'" field="text , name as value" orderby="name asc">
					<uni-data-select
					v-model="filter.type"
					placeholder="支出类型"
					:localdata="data"
				
				  ></uni-data-select>
		   </unicloud-db>
				</view>
			</view> 
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList"
						 :getone="false" :where="where_str"  orderby="ioeTime asc">
			<view class="info-area"> 
				<text>小计：</text><text>{{amountSum(data)}}元</text>
			</view>
		  <scroll-view scroll-x="false" scroll-y="true" style="height: calc(100vh - 160px);">
	
			
						 
						 <xt-panal-list :count="data.length">
							<template v-for="(item,index) in data" v-slot:[`card${index}`]>
								<view class="list">
									<view class="list-item"><text>时间：</text><text>{{new Date(item.ioeTime).Format("yyyy/MM/dd")}}</text></view>
									<view class="list-item"><text>类型：</text><text>{{item.type[0].text}}</text></view>
									<view class="list-item"><text>金额：</text><text>{{item.amount}}</text></view>
									<view class="list-item"><text>备注：</text><text>{{item.mark}}</text></view>
								</view>
							
								</template>
							</xt-panal-list>	
			
			
		</scroll-view>
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
			}
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
	background: #f4f4f4;
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
.info-area{
	color: #6a6a6a;
	font-size: 14px;
	padding:0px 20px;
	height: 40px;
	display: flex;
	align-items: center;
	font-weight: bold;


}
.list{
	color: #6a6a6a;
	font-size: 13px;
	.list-item{
		box-sizing: border-box;
		padding:4px 15px;
		display: flex;
		align-items: center;
		
	}
}
</style>
