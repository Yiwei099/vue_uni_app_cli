<script setup lang="ts">
import {onHide, onLaunch, onShow} from '@dcloudio/uni-app'

onLaunch(() => {

})
onShow(async () => {

})
onHide(() => {
  console.log('App Hide')
})

</script>

<style lang="scss">
page {
  background: transparent;
}
body {
    font-family: '思源黑体', 'Source Han Sans', sans-serif;
}

@import '@tuniao/tn-style/dist/uniapp/index.css';
// 字体图标
@import "@/static/font/iconfont.scss";

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// tab的样式
.uni-tabbar{
  background: #ffffffe6;
  backdrop-filter: blur(27.18px);
  box-shadow: inset 0 0.5px 0 0 #00000026;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 下载框
.progressBox{
    height: 180rpx;
    width: 450rpx;
    background-color: white;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .loading{
      margin-right: 20rpx;
    }
}
// 下拉框
.uniSelect{
  .uni-select{
    border: none!important;
    padding: 0!important;
  }
  .uni-select__selector-item{
    justify-content: center;
    font-size: 24rpx!important;
  }
}
.customSection {
  .uni-list-item__icon {
    margin-right: 0!important;
    .uni-list--base {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
.customSectionAbout {
  .container--right {
    padding-right: 0!important;
  }
  .uni-list-item__extra-text {
     color: #aaaaaa!important;
     font-size: 32rpx!important;
     font-weight: 400;
     font-family: "PingFang SC";
  }
  .uni-list-item:last-child {
    .container--right {
      margin-right: -0.9375rem;
    }
  }
}
.new_item_list {
  .uni-list-item__extra {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
  }
}
.subscribe_box {
  .tn-popup__content {
    box-shadow: 0 0.25rem 1rem 0.25rem rgba(0, 0, 0, 0.12);
  }
  .tn-icon-close {
    color: #212121;
    font-size: 36rpx;
  }
}
.tn_Number_Box {
  .tn-number-box__operation-btn {
    border-radius: 50%;
    background-color: #FF6628!important;
    color: #fff;
  }
  .tn-number-box__input {
    background-color: transparent!important;
    font-size: 32rpx;
    color: #333333;
  }
  .tn-number-box__operation-btn--minus {
    background-color: transparent!important;
    color: #FF6628;
    border: 2rpx solid #FF6628;
  }
}
.uni-input-placeholder{
  color: #d0d0d0 !important;
}
.uni-checkbox-input:hover{
  border-color: #d1d1d1 !important;
}
</style>
