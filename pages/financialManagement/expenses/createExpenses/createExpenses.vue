<template>
	<view class="createIncome">
        <uni-forms ref="incomeRef" :modelValue="expensesForm" :rules="incomeRules" label-width="90px">
           <uni-forms-item label="支出时间" required name="ioeTime"> 
			<uni-datetime-picker type="date" return-type="timestamp" :clear-icon="false" v-model="expensesForm.ioeTime" />
		   </uni-forms-item>
			<uni-forms-item label="支出类型" required name="type">
				<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="hm-incomeAndExpensesConfig"
						 :getone="false" where="billType=='expenses'" field="text , name as value" orderby="name asc">
						 <uni-data-select
						 v-model="expensesForm.type"
						 :localdata="data"

					   ></uni-data-select>
				</unicloud-db>
				
            </uni-forms-item>
            <uni-forms-item label="金额" name="amount" required>
                <view>
					<uni-easyinput type="digit" v-model="expensesForm.amount"  placeholder="请输入金额" ></uni-easyinput>
                </view>
            </uni-forms-item>
		
			<uni-forms-item label="备注" name="mark">
				<uni-easyinput v-model="expensesForm.mark" type="textarea" />
			</uni-forms-item>
	
			<uv-button type="success" text="保存" color="#007aff" @click="submit()" :disabled="submitDisabled"
            :loading="submitLoading" v-if="type!=2"></uv-button>
		
        </uni-forms>
        
    </view>
</template>

<script>
import {alert} from "@/alert";
import {FMService} from "@/services/FMService";
export default {
		data() {
			return {
				
				expensesForm:{
					hotel_id:"",
					type:"",
					ioeTime:"",
					amount:"",
					billType:"expenses",
					mark:""
				},
				incomeRules: {
					// 对name字段进行必填验证
					ioeTime:{
						rules:[{
								required: true,
								errorMessage: '请选择支出时间',
							}]
					},
					type:{
						rules:[{
								required: true,
								errorMessage: '请选择支出类型',
							}]
					},
					amount:{
						rules:[{
								required: true,
								errorMessage: '请输入金额',
							},
							{
								validateFunction: (rule, value,data,callback)=> {									
									
									if(value<=0){
										callback('收入不能小于0')
									}
									return true;
								}
							}]
					}
				
				
				}
	
			}
		},
		methods: {
			submit(){
				if(!this.$store.state.permissionStore.permissionList.includes('FM_CREATE')){
					 alert.alertNoPermisson();
					return;
				}
				this.$refs.incomeRef.validate().then(async res => {					
					this.expensesForm.amount = Number(this.expensesForm.amount);
					this.expensesForm.creater = this.$store.state.user.phone;
					this.expensesForm.hotel_id = this.$store.state.hotel_id;
					console.log(this.expensesForm)
					await FMService.add(this.expensesForm);
					const eventChannel = this.getOpenerEventChannel();
					eventChannel.emit('updateData');
					uni.navigateBack();
				})
			}
		}
	}
</script>

<style>
.createIncome{
	padding:20px;
}
.baseInput{
	font-size: 12px;
	color: #6a6a6a;
}
</style>
