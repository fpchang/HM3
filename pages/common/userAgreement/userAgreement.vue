<template>
	<view class="container">
		<view class="title"><text>议宿用户服务协议</text></view>
		<view><text>版本更新日期：2024年11月15日</text></view>
		<view><text>生效日期：2024年11月15日</text></view>
		<view><text>版本号：【2024v1】</text></view>

		<view><text>欢迎您使用我们的应用程序[议宿]，本协议是由 您 以下称 "用户" 与 "湖州玄天科技有限公司" 以下简称”玄天“之间缔结。在使用我们的应用程序之前，请您仔细阅读并理解本协议。</text></view>
		<view v-for="(item,index) of pList">
			<view class="p-title"><text>{{index+1}},{{item.title}}</text></view>
			<view class="p" v-for="i of item.content">{{i}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pList:[
					{
						title:'关于 "议宿" 应用程序',content:[
						" 本应用程序作为民宿，酒店管理工具类，提供订单记录，景点价格展示，餐饮点单等功能",
						"注册与使用：本应用程序使用手机号+验证码登录使用，手机号仅作为店铺绑定凭证。"
					]},
					{
						title:"服务条款",content:[
						" 我们的应用程序提供的服务包括但不限于信息展示、交流互动、交易等。",
						"我们有权根据实际情况调整或终止部分或全部服务。"
					]},
					{
						title:"用户信息保护",content:[
						" 我们尊重并保护用户的隐私，不会泄露用户的个人信息。",
						"用户在使用我们的应用程序时，需要提供一些个人信息，如手机号、邮箱等。",
						"我们将采取技术措施保护用户的个人信息安全。"
					]},	{
						title:"用户行为规范",content:[
						"用户在使用我们的应用程序时，应遵守法律法规和社会公德。",
						"用户不得利用我们的应用程序进行任何违法、违规或有悖公序良俗的活动。",
						"用户不得利用我们的应用程序进行任何违法、违规或有悖公序良俗的活动。"
					]},	{
						title:" 知识产权",content:[
						"我们的应用程序及其中的内容（包括但不限于文字、图片、视频等）的知识产权归我们所有。",
						"用户在使用我们的应用程序时，不得侵犯我们的知识产权。"
					]},	{
						title:"免责条款",content:[
						"我们不对我们的应用程序的服务中断或故障负责。",
						"我们不对用户因使用我们的应用程序而遭受的任何损失负责。",
						"我们不对用户之间的纠纷负责。"
					]},	{
						title:" 协议修改",content:[
						"我们有权根据实际情况修改本协议。",
						"修改后的协议将在我们的应用程序上公布，并立即生效。"
					]}
					,{
						title:"争议解决",content:[
						"如本协议与法律法规相冲突，以法律法规为准。",
						"如双方就本协议发生争议，应协商解决；协商不成的，任何一方均可向人民法院提起诉讼。"
					]}
					,{
						title:"其他",content:[
						"本协议自公布之日起生效。"
					]}
				]
			}
		},
		onShow() {
			// #ifdef H5
			document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
			// #endif
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.container{
	max-width:700px;
	padding:0 15px 30px 15px;
	margin:auto;
	font-size: $uni-font-size-sm;
}
	.title{
		padding:15px 0 ;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: $uni-font-size-lg;
	}
	.p-title{
		font-weight: bold;
		padding: 20px 0 10px 0;
	}
	.p{
		text-indent: 28px;
		padding:5px 0;
	}
	.strong{
		font-weight: bold;
	}

</style>
