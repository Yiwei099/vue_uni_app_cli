<template>
  <view class="cl-updata">
    <view class="file-list" :style="[listRowStyle]">

      <view v-for="(item, index) in previewList" @tap="clickSelectedFile(item, index)" class="file-list-row"
        :style="[rowStyle]" :key="index">

        <image class="_image" v-if="fileUrlType(item) === 'image'" :src="item.path" :style="[imgStyle]"
          mode="aspectFill">
        </image>

        <view v-else class="_video" :style="[imgStyle]">

          <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
          <video v-if="!autoUpload || cloudType === 'other'" class="_video" :style="[imgStyle]" :src="item.path"
            :show-center-play-btn="false" :show-fullscreen-btn="false" :show-play-btn="false" :show-loading="false"
            :enable-progress-gesture="false" :controls="false">
            <view @tap="previewVideo(item, index)" class="play">
              <image style="width: 100%;" :src="playImg" mode="widthFix"></image>
            </view>
          </video>

          <!-- #endif -->

          <!-- #ifdef APP-PLUS -->
          <video v-if="cloudType === 'other'" class="_video" :style="[imgStyle]" :src="item.path" :poster="item.path"
            :controls="false" :show-center-play-btn="false" :show-fullscreen-btn="false" :show-play-btn="false"
            :show-loading="false" :enable-progress-gesture="false">
            <cover-image class="app_play" :src="playImg" @tap="previewVideo(item, index)"></cover-image>
            <cover-view class="remove" v-if="remove" @tap="deleteSelectedFile(item, index)">
              <cover-image class="image" :src="deleteImg" mode="widthFix"
                @tap="deleteSelectedFile(item, index)"></cover-image>
            </cover-view>
          </video>
          <!-- #endif -->

          <!-- #ifndef MP-WEIXIN || MP-ALIPAY || APP-PLUS -->
          <video v-if="cloudType === 'other'" class="_video" :autoplay="false" :style="[imgStyle]" :src="item.path"
            :controls="false" :show-center-play-btn="false" :show-fullscreen-btn="false" :show-play-btn="false"
            :show-loading="false" :enable-progress-gesture="false">
            <cover-view @tap="previewVideo(item, index)" class="play">
              <cover-image style="width: 100%;" :src="playImg" mode="widthFix"></cover-image>
            </cover-view>
          </video>

          <!-- #endif -->

          <template v-else>
            <cl-image class="pay" :style="[imgStyle]" :cloudType="cloudType"
              :src="(item.poster || item.path)"></cl-image>

            <view class="play" @tap="previewVideo(item, index)">
              <image class="play-img" :src="playImg" mode="widthFix"></image>
            </view>
          </template>

        </view>

        <view class="remove" v-if="remove" @tap.stop="deleteSelectedFile(item, index)">
          <image class="image" :src="deleteImg" mode="widthFix"></image>
        </view>
      </view>

      <view v-if="add && FileList.length < max" @tap="selectFileTypeOnAdd" :style="[rowStyle]" class="file-list-row">
        <slot name="addImg">
          <div class="add-image">
            <image class="_image" style="width: 40rpx;" :src="addImg" mode="widthFix"></image>
            <text class="showNum" v-if="!tips">{{FileList.length}}/{{max}}</text>
            <text class="showNum1" v-if="tips">{{tips}}</text>
          </div>
        </slot>
      </view>
    </view>


    <view v-if="tempVideoUrl" class="mask">
      <image @tap="tempVideoUrl = ''" class="_root" :src="closeImg" mode="widthFix"></image>

      <view class="block" @tap.stop>
        <video class="block_video" autoplay :src="tempVideoUrl"></video>
      </view>
    </view>
  </view>
</template>

<script>
  import ClImage from '../cl-image/cl-image.vue'
  export default {
    name: "cl-upload",
    components: {
      ClImage
    },
    props: {
      //受控图片列表
      // #ifdef VUE2
      value: {
        type: Array,
        default: () => [],
      },
      // #endif

      // #ifdef VUE3
      modelValue: {
        type: Array,
        default: () => [],
      },
      // #endif

      // 存储云类型 oss阿里云  vframe七牛云   process腾讯云  other其他
      cloudType: {
        type: String,
        default: 'oss'
      },
      // 标识符,即后端接口参数名
      fileName: {
        type: String,
        default: 'file'
      },
      // 文件类型 'image', 'video', 'all'
      fileType: {
        type: String,
        default: 'all'
      },
      // 上传图片参数
      imageFormData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 上传视频参数
      videoFromData: {
        type: Object,
        default: () => {}
      },

      // 必选参数，上传的地址
      action: {
        type: String,
        default: ''
      },

      // 启用目录, 仅unicloud阿里云支持
      // https://uniapp.dcloud.net.cn/uniCloud/storage.html#storage-dir
      cloudPathAsRealPath: {
        type: Boolean,
        default: false
      },

      // 设置上传的请求头部
      headers: {
        type: Object,
        default: () => {}
      },

      // 上传时附带的额外参数
      data: {
        type: Object,
        default: () => {}
      },

      // 是否开启预览图片
      isPreviewImage: {
        type: Boolean,
        default: true
      },

      // 图片指示器样式，可取值："default" - 底部圆点指示器； "number" - 顶部数字指示器； "none" - 不显示指示器。
      indicator: {
        type: String,
        default: 'none'
      },
      // 是否在选取文件后立即进行上传
      autoUpload: {
        type: Boolean,
        default: true
      },
      // 是否显示删除按钮
      remove: {
        type: Boolean,
        default: true
      },
      // 是否添加按钮
      add: {
        type: Boolean,
        default: true
      },
      // 最多显示数量
      max: {
        type: Number,
        default: 9
      },
      // 视频最大上传数量
      maxVideo: {
        type: Number,
        default: 0
      },
      // 列表样式
      listStyle: {
        type: Object,
        default: () => {}
      },
      // 提示标题
      tips: {
        type: String,
        default: ''
      },
      // 删除提示弹窗标题
      deleteTitle: {
        type: String,
        default: '提示'
      },
      // 删除提示弹窗文案
      deleteText: {
        type: String,
        default: '您确认要删除吗？'
      },
      // 加载文案
      loadingText: {
        type: String,
        default: '正在上传中...'
      },
      // 是否开启删除前钩子
      useBeforeDelete: {
        type: Boolean,
        default: false
      },
      // 是否开启上传前钩子
      useBeforeUpload: {
        type: Boolean,
        default: false
      },
      // 添加按钮图片
      addImg: {
        type: String,
        default: 'https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/bb1550b3-e0a8-4a90-a86f-00f8c6afa9fb.png'
      },
      // 播放按钮图片
      playImg: {
        type: String,
        default: 'https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/ae40402f-aa53-4344-b553-2322799bebd6.png'
      },
      // 删除按钮图片
      deleteImg: {
        type: String,
        default: 'https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/d20177a5-417e-4c5d-a266-1988361c543d.png'
      },
      // 关闭视频按钮图片
      closeImg: {
        type: String,
        default: 'https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/cde4362d-7ec7-4cac-a692-12e1f576be1e.png'
      },
    },
    data() {
      return {
        // 渲染列表
        FileList: [],

        // 预览视频地址
        tempVideoUrl: '',

        // 临时文件列表
        tempFile_paths: [],

      };
    },
    watch: {
      // #ifdef VUE2
      'value': {
        handler: function(newVal, oldVal) {
          this.FileList = newVal;
        },
        deep: true,
        immediate: true
      },
      // #endif

      // #ifdef VUE3
      'modelValue': {
        handler: function(newVal, oldVal) {
          this.FileList = newVal;
        },
        deep: true,
        immediate: true
      },
      // #endif
    },
    computed: {
      previewList() {
        return this.FileList.map(item => {
          return {
            path: item.path || item,
            poster: item.poster || ''
          }
        })
      },
      listRowStyle() {
        const style = {
          'grid-template-columns': `repeat(${this.listStyle?.columns || 3}, 1fr)`, // 每行数量
          'grid-column-gap': this.listStyle?.columnGap || '40rpx', // 行间距
          'grid-row-gap': this.listStyle?.rowGap || '40rpx', // 列间距
          'padding': this.listStyle?.padding || '0rpx' // 列表内边距
        }

        return style;
      },
      rowStyle() {
        const {
          height = '176rpx', ratio
        } = this.listStyle || {};
        const style = {
          'aspect-ratio': height ? '' : ratio || '1/1', // 图片比例
          'height': height,
          'width': this.fileType == 'all' ? '176rpx' : '280rpx',
        };

        return style;
      },

      imgStyle() {
        const style = {
          'border-radius': this.listStyle?.radius || '6rpx', // 图片圆角
        }
        return style;
      }
    },
    methods: {
      /**
       * 删除已选择文件
       * @param {object} item 文件信息
       * @param {number} selectedFileIndex 文件索引
       * */
      deleteSelectedFile(item, selectedFileIndex) {

        const fileToDelete = this.FileList[selectedFileIndex];

        // 删除前钩子
        if (this.useBeforeDelete) {
          this.$emit('beforeDelete', fileToDelete, selectedFileIndex, () => {
            return deleteFileFromList()
          })
        }

        if (!this.useBeforeDelete) {
          uni.showModal({
            title: this.deleteTitle,
            content: this.deleteText,
            success: (res) => {
              if (res.confirm) {
                deleteFileFromList()
              }
            }
          });
        }

        const deleteFileFromList = () => {
          const tempFileIndex = this.tempFile_paths.indexOf(item || item.path);

          if (tempFileIndex > -1) {
            this.tempFile_paths.splice(tempFileIndex, 1)
          }

          this.FileList.splice(selectedFileIndex, 1)

          // #ifdef VUE2
          this.$emit('input', this.FileList)
          // #endif

          // #ifdef VUE3
          this.$emit("update:modelValue", this.FileList);
          // #endif
        }

      },

      /**
       * 点击已选择文件
       * @param {object} item 文件信息
       * @param {number} index 文件索引
       * */
      clickSelectedFile(item, index) {
        this.previewImage(item?.path ?? item, index);
        this.$emit('onImage', {
          item,
          index
        })
      },

      /**
       * 点击选择图片按钮
       * */
      selectFileTypeOnAdd() {

        switch (this.fileType) {
          case 'image':
            this.handleFileSelection(1);
            break;
          case 'video':
            this.handleFileSelection(2);
            break;
          case 'all':
            uni.showActionSheet({
              itemList: ['相册', '视频'],
              success: (res) => {
                const tapIndex = res.tapIndex;
                if (tapIndex === 0) {
                  this.handleFileSelection(1);
                } else {
                  this.handleFileSelection(2);
                }
              },
              fail: (res) => {
                console.error(res.errMsg);
              }
            });
            break;
          default:
            this.handleFileSelection(1);
            break;
        }
      },


      /**
       * 从本地选择文件。
       * @param { number } updataType 选择类型 1:图片 2视频
       * */
      async handleFileSelection(updataType) {
        const that = this;
        if (updataType === 1) {

          const data = Object.assign({}, {
            // 最多可以选择的图片张数，默认9
            count: 9,
            // 仅对 mediaType 为 image 时有效，是否压缩所选文件
            // #ifndef MP-TOUTIAO
            sizeType: ['original', 'compressed'],
            // #endif
            // album 从相册选图，camera 使用相机，默认二者都有。
            sourceType: ['camera', 'album'],

            compress: false
          }, this.imageFormData)

          data['count'] = this.max - this.FileList.length

          uni.chooseImage({
            ...data,
            success: async (res) => {
              let tempFiles = res.tempFiles
              const compress = that.imageFormData?.compress || false;

              // 限制图片上传尺寸
              if (that.imageFormData?.size ?? false) {
                const maxSize = that.imageFormData.size * 1024 * 1024

                tempFiles.map((imgInfo, index) => {
                  if (imgInfo.size > maxSize) {
                    tempFiles.splice(index, 1)
                    that.$emit('onImageSize', imgInfo)
                    return uni.showToast({
                      title: `图片最大上传${that.imageFormData.size}MB`,
                      duration: 2000,
                      icon: 'none'
                    });
                  }
                })
              }

              // 开启压缩图片
              if (compress) {
                const compressedImagePathList = tempFiles.map(imageItem => {
                  return that.compressImage(imageItem.path)
                })

                Promise.all(compressedImagePathList).then(result => {
                  upload(result);
                })

              } else {
                upload(tempFiles);
              }

              function upload(tempImages) {
                if (that.autoUpload) {
                  tempImages.map(item => {
                    that.onBeforeUploadFile(item, 'image')
                  })
                } else {
                  that.FileList = [...that.FileList, ...tempImages]
                  tempImages.map(item => {
                    that.tempFile_paths.push(item)
                  })
                }
              }

            },
            fail(err) {
              console.error('选择图片失败', err)
              that.$emit('onError', err)
            }

          })
        }

        if (updataType === 2) {

          // 限制视频最大上传数量
          const VIDEO_REGEXP = /\.(mp4|flv|avi)/i
          const videoList = await that.FileList.filter(item => {
            const fileUrl = item?.url ?? item
            return VIDEO_REGEXP.test(fileUrl)
          })

          if (that.maxVideo > 0 && videoList.length >= that.maxVideo) {
            that.$emit('onVideoMax', that.maxVideo, videoList.length)
            return uni.showToast({
              title: '视频数量已超出',
              duration: 2000,
              icon: 'none'
            });
          }

          const data = Object.assign({}, {
            // 	拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
            maxDuration: 60,
            // #ifndef MP-TOUTIAO
            // 'front'、'back'，默认'back'
            camera: "back",
            // #endif

            // album 从相册选视频，camera 使用相机拍摄，默认二者都有。
            sourceType: ['camera', 'album'],
            // 是否压缩所选的视频源文件，默认值为 true，需要压缩。
            compressed: true,
            // 'front'、'back'，默认'back'
          }, this.videoFromData)

          uni.chooseVideo({
            ...data,
            success: (res) => {
              let tempFilePath = {
                ...res
              }
              tempFilePath['path'] = res.tempFilePath

              // 限制视频上传尺寸
              if (that.videoFromData?.size ?? false) {
                const maxSize = that.videoFromData.size * 1024 * 1024

                if (tempFilePath.size > maxSize) {
                  uni.showToast({
                    title: `视频最大上传${that.videoFromData.size}MB`,
                    duration: 2000,
                    icon: 'none'
                  });
                  return false;
                }

              }
              if (that.autoUpload) {
                that.onBeforeUploadFile(tempFilePath, 'video')
              } else {
                that.FileList.push(tempFilePath)
                that.tempFile_paths.push(tempFilePath)
              }
            },
            fail(err) {
              console.error('选择视频失败', err)
            }

          })
        }
      },

      /**
       * 上传前钩子
       * @param { tempFile } 临时文件
       * @return { Promise }
       * */
      onBeforeUploadFile(tempFile) {
        if (this.useBeforeUpload) {
          return this.$emit('beforeUpload', tempFile, () => {
            return this.updataFile(tempFile);
          })
        }
        return this.updataFile(tempFile);
      },

      /**
       * 上传文件到服务器
       * @param { tempFile } 临时文件
       * @return { Promise }
       * */
      updataFile(tempFile) {
        const that = this;
        const filePath = tempFile.path || tempFile;
        const fileType = this.fileUrlType(filePath) == 'image' ? '.png' : '.mp4';
        const fileName = tempFile.name || Date.now() + fileType;

        uni.showLoading({
          title: this.loadingText,
          icon: 'loading'
        })

        return new Promise((resolve, reject) => {
          // uniCloud上传
          if (that.action === 'uniCloud') {

            uniCloud.uploadFile({
              cloudPath: String(fileName),
              filePath: filePath,
              // #ifdef MP-ALIPAY
              fileType: fileType,
              // #endif
              cloudPathAsRealPath: this.cloudPathAsRealPath,

              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                that.$emit('onProgress', percentCompleted)
              },
              success(result) {
                if (that.autoUpload) {
                  that.FileList.push(result.fileID)
                } else {
                  that.FileList.map((item, index) => {
                    if (item === filePath || item.path === filePath) {
                      that.FileList.splice(index, 1, result.fileID)
                    }
                  })
                }

                // #ifdef VUE2
                that.$emit('input', that.FileList)
                // #endif
                // #ifdef VUE3
                that.$emit("update:modelValue", that.FileList);
                // #endif

                resolve(result.fileID)
                uni.hideLoading();
                that.$emit('onProgress', {
                  ...result
                })
              },
              fail: (error) => {
                uni.hideLoading();
                console.error('error', error);
                that.$emit('onError', error)
                reject(error)
              }
            })
            return false;
          }

          // 接口服务上传
          const uploadTask = uni.uploadFile({
            url: that.action,
            filePath: filePath,
            name: that.fileName,
            formData: that.data,
            header: that.headers,
            // #ifdef MP-ALIPAY
            fileType: filetype,
            // #endif
            success: (uploadFileRes) => {
              const data = JSON.parse(uploadFileRes.data)
              uni.hideLoading();
              that.success(data)

              if (!this.autoUpload) {
                that.FileList.map((item, index) => {
                  if (item === filePath || item.path === filePath) {
                    that.FileList.splice(index, 1)
                  }
                })
              }

              resolve(data)
            },
            fail: (error) => {
              uni.hideLoading();
              console.error('error', error);
              that.$emit('onError', error)
              reject(error)
            }
          });

          uploadTask.onProgressUpdate((res) => {
            that.$emit('onProgress', {
              ...res,
              ...tempFile
            })
          });
        })
      },

      /**
       * 手动上传
       * */
      submit() {

        return new Promise((resolve, reject) => {
          if (this.tempFile_paths.length <= 0) {
            resolve([])
          }

          const uploadedFilePaths = this.tempFile_paths.map(item => {
            return this.onBeforeUploadFile(item || item.path)
          })

          Promise.all(uploadedFilePaths).then(res => {
            this.tempFile_paths = []
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })

      },

      /**
       * 返回数据
       * @param {array} data 上传成功后的数据
       * @return {array} 返回数据
       * */
      success(data) {
        this.$emit('onSuccess', data);

        // 自定义数据结构-选择性开启
        // const list = data.map(item=> {
        // 	return JSON.parse(item).data.link;
        // })
        // this.$emit('input', [...this.FileList, ...list]);
      },
      /**
       * 压缩图片
       * @param {array} tempFilePaths 临时路径数组
       * @return {array} 被压缩过的路径数组
       * */
      async compressImage(tempFilePaths) {
        const that = this;

        return new Promise((resolve, reject) => {

          if (typeof tempFilePaths !== 'string') {
            console.error('压缩路径错误')
            reject([])
          }

          uni.showLoading({
            title: '压缩中...',
            icon: 'loading',
          })

          // #ifdef H5
          this.canvasDataURL(tempFilePaths, {
            quality: that.imageFormData.quality / 100
          }, (base64Codes) => {
            resolve(base64Codes);
            uni.hideLoading();
          })
          // #endif

          // #ifndef H5
          uni.compressImage({
            src: tempFilePaths,
            quality: that.imageFormData.quality || 80,
            success: res => {
              resolve(res.tempFilePath);
              uni.hideLoading();
            },
            fail(err) {
              reject(err);
              uni.hideLoading();
            }
          })
          // #endif

        })
      },

      /**
       * H5压缩图片质量
       * @param {string} path 图片路径
       * @param {object} obj 压缩配置
       * @param {function} callback 回调函数
       * @return {string} base64
       * */
      canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function() {
          var that = this;
          // 默认按比例压缩
          var w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          var quality = 0.8; // 默认图片质量为0.8
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL('image/jpeg', quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },

      /**
       * 预览图片
       * @param {string, object} item 文件信息
       * */
      previewImage(item) {
        if (this.fileUrlType(item) === 'video') return false;
        if (!this.isPreviewImage) return false;

        const imgs = this.FileList.filter(item => {
          return this.fileUrlType(item) !== 'video'
        }).map(item => item?.path ?? item)
        const current = imgs.indexOf(item || item.path);

        uni.previewImage({
          current: current,
          urls: imgs,
          success() {},
          fail(err) {
            console.log(err);
          }
        })
      },

      /**
       * 预览视频
       * @param {string, object} item 文件信息
       * @param {number} index 索引
       * */
      previewVideo(item, index) {
        this.$emit('onVideo', {
          item,
          index
        })
        this.tempVideoUrl = item.path;
      },

      /**
       * 是否img类型
       * @param {string, object} item 文件信息
       * @return {boolean} 是否img类型
       * */
      fileUrlType(file) {
        const filePath = file.path || file;

        if (this.isBase64(filePath)) return 'image'

        const fileType = filePath.split('.').pop();

        const IMAGE_REGEXP = /(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i
        if (IMAGE_REGEXP.test(fileType)) {
          return 'image';
        } else {
          return 'video';
        }
      },
      // 判断是否是base64
      isBase64(str) {
        if (str === '' || typeof str !== 'string') return console.error('文件路径错误, base64', str);
        return str.includes('blob:') || str.includes('data:image');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cl-updata {

    .file-list {
      display: grid;
      margin: 24rpx auto;

      &-row {
        display: inline-flex;
        align-items: center;
        position: relative;

        .play-img {
          width: 100%;
        }

        ._image {
          height: 100%;
          width: 100%;
        }

        .showNum,
        .showNum1 {
          position: absolute;
          bottom: 14rpx;
          color: rgb(170, 170, 170);
          text-align: center;
          font-size: 24rpx;
          font-weight: 400;
          font-family: "PingFang SC";
        }

        .showNum1 {
          zoom: 0.9;
        }

        ._video {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .video-fixed {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
          z-index: 96;
        }

        .play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30%;
          z-index: 95;
        }

        .app_play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50rpx;
          height: 50rpx;
        }

        .remove {
          position: absolute;
          top: 8rpx;
          right: 6rpx;
          background-color: rgba(0, 0, 0, 0.4);
          height: 32rpx;
          width: 32rpx;
          // border-bottom-left-radius: 200rpx;
          border-radius: 24rpx;
          z-index: 97;

          .image {
            width: 16rpx;
            height: 16rpx;
            position: absolute;
            right: 8rpx;
            top: 8rpx;
          }
        }
      }

      .add-image {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx dashed #ccc;
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
        background: rgb(250, 250, 250);

        &:active {
          opacity: 0.8;
        }

        ._image {
          width: 40%;
        }
      }
    }

    .mask {
      background-color: #000;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 99;

      .block {
        padding: 0 30rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;

        .block_video {
          width: 100%;
          height: 78vh;
        }
      }

      ._root {
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        left: 40rpx;
        top: 5vh
      }
    }
  }
</style>
