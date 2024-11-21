<template>
	<view class="roomTypeImages">
    <xt-file-picker ref="ttf" @success="uploadSuccess" :autoUpload="true" :cloudPath="cloudPath" :imagesList="imagesList"></xt-file-picker>
		<view>
			<button @click="submit">submit</button>
		</view>
	</view>
</template>

<script>
	export default {
  components: {  },
		data() {
			return {
                cloudPath:`/HM/roomType/${this.hotel_id}/`,
                imagesList:["https://env-00jxh1m2dpmq.normal.cloudstatic.cn/HM/roomType/undefined/1732203432798软著作.jpg?expire_at=1732204034&er_sign=6ae355f988047fd48ad711c451ec52b5"]
			}
		},
        computed:{
            hotel_id(){
                return this.$store.state.hotel_id;
            }
        },
		methods: {
			progress(e) {
				console.log("progress", e);
			},
            uploadSuccess(list){
                console.log("接收到全部上传成功",list);
            },
			submit() {
				this.$refs.ttf.upload();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.roomTypeImages {}

	.m-list {
		display: flex;
		flex-wrap: wrap;

		.m-list-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			padding: 10px;
			box-sizing: border-box;
			background: red;

			.im-cont {
				background: green;
				min-width: 187.5px;
				min-height: 120px;
			}
		}
	}
</style>