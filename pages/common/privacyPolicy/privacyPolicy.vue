<template>
	<view class="container">
		<view class="title"><text>议宿隐私保护政策</text></view>
		<view><text>版本发布日期：2024年11月15日</text></view>
		<view><text>生效日期：2024年11月15日</text></view>		
		<view><text>本隐私政策旨在说明我们（议宿）如何收集、使用、存储及保护您的个人信息。我们承诺将严格遵守相关法律法规，确保您的个人信息安全</text></view>
		<view v-for="item of pList">
			<view class="p-title"><text>{{item.title}}</text></view>
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
						title:"信息收集",content:[
						"用户信息：在注册、登录及使用应用过程中，我们可能会收集您的昵称、头像、手机号等基本信息。",
						"设备信息：为了提供更好的服务，我们可能会收集您的设备型号、操作系统版本、IP地址等信息。",
						"使用行为信息：我们可能会记录您的使用行为，如访问页面、点击次数、停留时间等，以便优化服务。"
					]},
					{
						title:"信息使用",content:[
						" 提供服务：我们会使用您的信息来提供、优化及个性化我们的服务。",
						"数据分析：我们会对收集的信息进行统计分析，以改进服务质量和用户体验。",
						"安全保障：我们会使用您的信息来保障账号安全，防止欺诈行为。"
					]},	{
						title:"信息存储",content:[
						"存储地点：您的信息将存储在我们的服务器上，服务器位于中国境内。",
						"存储期限：我们会根据法律法规要求及业务需求，合理确定信息的存储期限。"
					]},	{
						title:" 信息安全",content:[
						"加密技术：我们采用加密技术对您的信息进行加密存储和传输，确保信息安全。",
						"访问控制：我们严格限制对信息的访问权限，只有授权人员才能访问。",
						"安全审计：我们会定期对系统进行安全审计，及时发现并修复潜在的安全漏洞。"
					]},	{
						title:"第三方服务",content:[
						"我们可能会与第三方服务提供商合作，如支付机构、数据分析公司等。我们会与第三方签订保密协议，并要求其遵守相关法律法规及本隐私政策。",
						"我们的产品基于DCloud uni-app(5+ App/Wap2App)开发，应用运行期间需要收集您的设备唯一识别码（IMEI/android ID/DEVICE_ID/IDFA、SIM 卡 IMSI 信息、OAID）以提供统计分析服务，并通过应用启动数据及异常错误日志分析改进性能和用户体验，为用户提供更好的服务。详情内容请访问《DCloud用户服务条款》。（DCloud用户服务条款超链至：https://ask.dcloud.net.cn/protocol.html"
		
				
					]},	{
						title:"用户权利",content:[
						"查询：您有权查询我们收集的信息。",
						"更正：您有权更正我们收集的错误信息。",
						"删除：在符合法律法规要求的情况下，您有权要求我们删除您的信息",
						"删除：在符合法律法规要求的情况下，您有权要求我们删除您的信息"
					]}
					,{
						title:"隐私政策的更新",content:[
						"我们可能会根据法律法规要求及业务需求，对本隐私政策进行更新。我们会通过公告、推送等方式通知您隐私政策的更新情况。"
						
			]}
					,{
						title:"联系方式",content:[
						"如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：",
						"开发者名称：湖州玄天科技有限公司",
						"邮箱：xtst2023@outlook.com",
						"电话：18516285834",
						"我们承诺将尽快回复您的咨询和投诉。"
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
		padding-top: 30px;
	}
	.p{
		text-indent: 28px;
		padding:5px 0;
	}
	.strong{
		font-weight: bold;
	}

</style>
