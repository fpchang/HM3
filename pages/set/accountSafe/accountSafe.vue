<template>
	<view>
		<view>
			<xt-panal-list :count="1">
				<template v-slot:["card0"]>
					<uni-list>
						<uni-list-item title="会员名" :rightText="user.userName||'--'"></uni-list-item>
						<uni-list-item title="手机号" :rightText="geTel('13122998844')"></uni-list-item>
						<uni-list-item v-if="accountIsValid" title="账号注销" note="注销后无法恢复" link
							@click="closeAccount"></uni-list-item>
						<uni-list-item clickable @click="onClick" v-if="!accountIsValid">
							<template v-slot:body>
								<view style="text-align:center;flex:1;color:#3b4144" @click="recoverAccount">
									<view style="display:flex;flex-direction:column;justify-content:space-around">
										<text class="slot-box slot-text">恢复账号</text>
										<text class="slot-box slot-text" style="font-size: 12px;">将在 {{new
											Date(user.closeAccountDateTime+1000*60*60*24*7).Format("yyyy-MM-dd")}}
											注销</text>

									</view>
								</view>

							</template>
						</uni-list-item>
					</uni-list>
				</template>
			</xt-panal-list>
		</view>
	</view>
</template>

<script>
import { AccountService } from '../../../services/AccountService';
import { HotelService } from '../../../services/HotelService';
import {computed} from "vue";
import {useStore} from "vuex";
	export default {
		setup(){
			const store = useStore();
			const user = computed(()=>{
				return store.state.user;
			})
			const accountIsValid=computed(()=>{
				return user.value.accountStatus!=9&&user.value.accountStatus!=10;
			})
			return {user,accountIsValid}
		},
		data() {
			return {
				
			}
		},
		methods: {
		 geTel(tel) {
			tel=""+tel;
			var reg=/(\d{3})\d{4}(\d{4})/;
			var result = tel.replace(reg, "$1****$2")
			return result;
		},
			async recoverAccount(){
				const conf = await uni.showModal({
					title: '确认恢复',
					content: '恢复到注销前数据状态',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认'
				});
				if (conf["cancel"]) {
					return;
				}
				try {
					console.log(this.user)
					const res = await AccountService.recoverAccount(this.user._id);
					await this.$store.dispatch("getUser");
					uni.navigateBack();
				} catch (error) {
					console.log(error)
				}
				
			},
			async closeAccount(){
				const conf = await uni.showModal({
					title: '确认注销',
					content: '注销后7天内可恢复，超过7天将失去账号数据',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认'
				});
				if (conf["cancel"]) {
					return;
				}
				try {
					const phone =this.$store.state.user.phone;
				const res = await HotelService.getHotelListOfUser(phone);
				console.log(res)
				if(res.result.data.length){
					uni.showToast({title:"当前用户名下有关联酒店",icon:"none"});
					return;
				}				
				const r = await AccountService.closeAccount();
				this.$store.dispatch("loginOut");
				} catch (error) {
					
				}
				
			}
		}
	}
</script>

<style></style>
