<template>
  <view m-container>
    <view class="title-container" v-if="showTitle">
      <text class="text-style">最多可选9张图片</text>
      <text class="text-style">{{selectImageList.length}}/{{max}}</text>
    </view>
            <view class="m-list">
                <view class="m-list-item" v-for="(item,index) of selectImageList">
                    <view class="im-cont">
                      <image class="imgStyle" :src="item.filePath" mode="aspectFill"></image>
                      <view class="progress-container" v-if="item.uploadStatus==0&&item.percentCompleted>0">
                        <progress :percent="item.percentCompleted" border-radius="12" stroke-width="20" activeColor="orange" :show-info="false"></progress>
                      </view>
                      <view class="delete-container" v-if="!disabled">
                        <uni-icons  type="trash" size="50" @click="deleteFile(index)" color="#fff"></uni-icons>
                      </view>
                      <view class="reUpdate-container" @click="upload" v-if="item.uploadStatus==2">
                        <view class="c" style=""> 
                          <uni-icons  type="reload" size="50" color="#fff"></uni-icons>
                          <view><text style="color:#fff">上传失败，重新上传</text></view>
                        </view>
                        
                      </view>
                    </view>
                </view>
                <view class="m-list-item" v-if="!disabled&&selectImageList.length<max">
                  <view class="im-cont flex-center" @click="chooseImages">
                    <uni-icons type="plusempty" size="70" color='#f1f1f1'></uni-icons>
                  </view>
              </view>
              <view class="placeholder" v-for="item in 4">
            </view>
            </view>
        </view>
</template>

<script lang="ts">
export default{
  name: "xt-file-picker",
  props: {
    showTitle:{
      type:Boolean,
      default:false
    },
    imagesList:Array,
    max:{
      type:Number,
      default:9
    },
    disabled:{
      type:Boolean,
      default:false
    },
    autoUpload:{
      type:Boolean,
      default:true,
    },
    cloudPath:{
      type:String,
      default:""
    },
  },
  data() {
    return {
      uploadComplement:true,
     // autoUpload:false,
           
      selectImageList:[]
    }
  },
  computed: {},
  created(){
    //uploadStatus 0 待上传，1已上传，2上传失败
    if(this.imagesList&&this.imagesList.length){
      this.selectImageList=this.imagesList.map(item=>{
        return {
          filePath:item,
          fileName:"",
          uploadStatus:1,
          percentCompleted:100
        }
      })
    }
  },
  methods: {
    deleteFile(index){
      console.log("deleete")
      this.selectImageList.splice(index,1);
      this.getReturnValueList();
    },
    chooseImages() {
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.uploadComplement=false;
						console.log(res)
						//this.imageValue = res.tempFilePaths;
            let len =Math.min(res.tempFilePaths.length,(this.max- this.selectImageList.length)) ;
            for(let i=0;i<len;i++){
              this.selectImageList.push({
                filePath:res.tempFilePaths[i],
                fileName:res.tempFiles[i].name||`img${i}`,
                percentCompleted:0,
                uploadStatus:0
              });
            }
             if(this.autoUpload){
              console.log("开始自动上传")
              this.upload();
             }                    
					}
				});

			},
			async upload() {
        let task=[];
        for(let i = 0;i<this.selectImageList.length;i++){
          const item = this.selectImageList[i];
          if(item.uploadStatus==1){
            continue;
          }
          task.push(new Promise((resolve,reject)=>{
            let path= `/HM/client${this.cloudPath}${Date.now()}_${item.fileName}`;
            uniCloud.uploadFile({
                filePath: item.filePath,
                cloudPath:path ,
                onUploadProgress: function(progressEvent) {
                  item.percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                },
                success:async (e) =>{
                    item.uploadStatus=1;
                    const res = await uniCloud.getTempFileURL({fileList:[e.fileID]});
                    item.filePath=res.fileList[0].tempFileURL;
                    resolve(e);
                          },
                fail(f) {
                  console.log("上传fail",f);
                  item.uploadStatus=2;
                  reject(f)
                }
              });
          }))
        }
        try {
          if(task.length<1){
            console.log("没有可以上传的内容");
            return;
          }
          const res = await Promise.all(task);
        this.uploadComplement=true;
        console.log("全部上传成功",res);
          this.getReturnValueList();
        } catch (error) {
          console.log("全部上传error",error);
        }
        
			
			},
     async getReturnValueList(upLoadRes){
      let noList = this.selectImageList.filter(item=>item.uploadStatus!=1);
      if(noList&&noList.length){
        console.log("有上传失败或者未上传的文件，请先处理");
        return;
      }
          //组件原来的图片数据
          let returnList = this.selectImageList.map(item=>item.filePath)
          this.$emit("success",returnList);
      },
       getTempFileURL(fileList){
        return uniCloud.getTempFileURL({
		        fileList
	    });
      return res;
      },
      //上传状态 0 上传中，1上传成功，2 有失败的
      uploadingState(){
        let list_isLoading= this.selectImageList.filter(item=>{return item.uploadStatus==0});//上传中
        let list_lodingError= this.selectImageList.filter(item=>{return item.uploadStatus==2});//有上传失败的
        return list_isLoading.length?0:(list_lodingError.length?2:1);
      },
     isUploading(){
      
       let list= this.selectImageList.filter(item=>{return item.uploadStatus==0});//上传中
       console.log("调用状态",list)
       return list.length?true:false;
      }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.title-container{
  display: flex;
  justify-content: space-between;
  .text-style{
    padding: 10px;
    font-size: 14px;
    color: #333;
  }
}
.m-list {
  display: flex;
  flex-wrap: wrap;

  justify-content: space-between;
  .m-list-item {
    display: flex;
    flex-direction: column;
    width: 175px;
    height: 175px;
    box-sizing: border-box;
    padding:10px 5px;

    .im-cont {
      border:1px solid rgb(238, 238, 238);
      box-sizing: border-box;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .imgStyle{
        width: 100%;
        height:100%;
      }
      .progress-container{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
      .delete-container{
        position: absolute;
        top:0;
        right: 0;
        z-index: 999;
        background: rgba(0,0,0,0.1);
        &:hover{
          background: rgba(0,0,0,0.4);
        }
      };
     .reUpdate-container{
      position: absolute;
        top:0;
        left: 0;
        width: 165px;
        height: 165px;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        .c{
          display: flex;
          flex-direction:column;
          align-items:center;
          justify-content:center
        }
     }       
    }
  }
  .placeholder{
    width: 187.5px;
    height:0;
  }
}
</style>