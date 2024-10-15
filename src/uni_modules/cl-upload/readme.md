### cl-upload 上传组件

> 支持手动自动上传，样式调整，参数配置，预览，删除等功能


> `注意：每次上传都需要回调函数接收参数并且添加到与组件绑定的数组中以保持数据一致,这样做是因为组件不知道服务端返回的数据格式，也可以在组件中修改promise格式 一劳永逸`

### 注意事项
1. ratio 图片比例属性部分手机不支持，可选用height属性代替
2. 自定义播放按钮部分平台有兼容性问题，可选择性关闭
3. 开启压缩图片返回的临时路径没有尾缀，官方api的问题。真机上没问题，也可以在上传的时候手动添加尾缀
4. **视频地址必须`https`, http可能导致无法显示封面图**
5. 如果没条件用`https`那就配置`cloudType: other`

### H5体验地址
![image](https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/eff364bc-65f7-47e0-ae4b-7d5f19b9f094.png)

#### list数据格式

1. 数组格式
```
['地址1','地址2']
```
2. JSON格式
```
[
    {
        path: '地址1.png',
        // 其他信息
    },
    {
        path: '地址2.mp4',
        poster: '自定义封面.png'
        // 其他信息
    },
    {
        path: '地址3.mp4',
        poster: require('../../static/c1.png'), // 封面也可以是本地图片
        // 其他信息
    },
]
```

#### 基础使用

```
<cl-upload v-model="list" action="请求地址" @onSuccess="onSuccess"></cl-upload>

methods: {
    /**
	 * 自动上传返回的是一张图片信息
	 * 手动上传返回的是已选中所有图片或者视频信息
	 * */ 
	onSuccess(reslut) {
		// 把服务端返回的图片地址添加到list中与组件数据同步
		this.list.push(reslut.url)
	},
}
```
### uniCloud上传
> 一句代码实现上传,就是这么简单

```
<cl-upload v-model="list" action="uniCloud"></cl-upload>
```

### 自定义样式
> 通过 listStyle 控制每行数量、比例、行间距、列间距等常用样式

```
<cl-upload v-model="list" :listStyle="{
	columns: 2,
	columnGap: '20rpx',
	rowGap:'20rpx',
	padding:'10rpx',
	height:'300rpx',
	radius:'20rpx'
}">
    <template v-slot:addImg>
		<view class="newAddImg">
			<view>＋</view>
			<text >添加</text>
		</view>
	</template>
</cl-upload>
```

### 预览模式
> 关闭显示添加按钮和删除按钮
```
<cl-upload v-model="list" :add="false" :remove="false"></cl-upload>
```

### 手动上传

> 通过 autoUpload 关闭掉自动上传，提交的时候通过 refs 主动调用组件上传方法，返回本次提交成功服务器返回数据

```
<cl-upload 
	ref="upload2" 
	v-model="list2" 
	:autoUpload="false"></cl-upload>
	
<button @tap="submit">手动提交</button>

methods: {
    submit() {
    	/**
    	 * 主动调用组件上传方法
    	 * */ 
    	this.$refs.upload2.submit().then(reslut=>{
    		console.log(reslut); // 本次提交成功服务器返回数据
    		
    		// 上传第三方服务器需要手动同步数据
    		// 上传uniCloud则不需要
    		const imgUrls = reslut.list.map(imgInfo=> imgInfo.url);
    		this.list2 = [...this.list2, ...imgUrls]
    	})
    },
}
```

### 配置删除前和上传前钩子
```
/ **
* 开启删除前钩子 useBeforeDelete
* 开启上传前钩子 useBeforeUpload
*/
<cl-upload v-model="list" 
    useBeforeDelete 
    useBeforeUpload
    @beforeDelete="beforeDelete"
    @beforeUpload="beforeUpload"></cl-upload>
    

methods: {
    /**
	 * 删除前钩子
	 * @param {Object} item 当前删除的图片或者视频信息
	 * @param {Number} index 当前删除的图片或视频索引
	 * @param {Function} next 调用此函数继续执行组件删除逻辑
	 * */ 
	beforeDelete(item, index, next) {
		uni.showModal({
			title: '提示信息',
			content: '确定要删除这个文件嘛？',
			success: res => {
				if (res.confirm) {
					// 模拟服务器接口
					setTimeout(() => {
						next();
					}, 1000);
				}
			}
		});
	},
	/**
	 * 上传前钩子
	 * @param {Object} tempFile 当前上传文件信息
	 * @param {Function} next 调用此函数继续执行组件上传逻辑
	 * */
	beforeUpload(tempFile, next) {
		// 自己的上传逻辑
		// 如果不需要走组件的上传逻辑就不用调用next(), 但是上传完要同步到list
	}
}
```

## API 

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| action | 上传地址 | String |-| uniCloud |
| cloudPathAsRealPath | 启用目录, 仅unicloud阿里云支持`1.4.0` `HBuilderX 3.8.5` | Boolean |false| true |
| cloudType | 存储云类型(各个云服务截取封面方式不同。 other选项是video保底手段,部分平台有兼容性问题) | String |oss| 阿里云:oss  七牛云:vframe   腾讯云:process  其他:other |
| headers | 设置上传的请求头部 | Object | - |-  |
| data | 上传时附带的额外参数 | Object | - | - |
| fileName| 标识符,即后端接口参数名 | String | file | - |
| fileType | 文件类型 | String | all | 'image', 'video', 'all' |
| imageFormData | 上传图片参数 | Object | - | - |
| videoFromData | 上传视频参数 | Object  | - | - |
| listStyle | 列表样式 |Object  | - | - |
| isPreviewImage | 是否开启预览图片 | Boolean | true |false  |
| remove | 是否显示删除按钮 | Boolean | true |false  |
| add | 是否添加按钮 | Boolean | true |false  |
| max | 最多显示数量 | Number | 9 | -  |
| maxVideo | 视频最大上传数量 | Number | 不限制 |  - |
| deleteTitle| 删除提示弹窗标题 | String | 提示 |  - |
| deleteText| 删除提示弹窗文案 | String | 您确认要删除吗？ | - |
| loadingText| 加载文案 | String | 正在上传中... | - |
| useBeforeDelete| 是否开启删除前钩子  | Boolean | false  | true |
| useBeforeUpload | 是否开启上传前钩子 | Boolean | false  | true |
| addImg| 添加按钮图片 | String | - |  - |
| playImg| 播放按钮图片 | String | - |  - |
| deleteImg| 删除按钮图片 | String | - |  - |
| closeImg| 关闭视频按钮图片 | String | - |  - |

#### imageFormData

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| count | 最多可以选择的图片张数 | number |9| - |
| sizeType | original 原图，compressed 压缩图 | array | 默认二者都有 |-  |
| sourceType | 相册或者相机 | array |  ['camera ', 'album'] | ['camera ', 'album']  |
| compress | 是否开启图片压缩 | Boolean | false | true  |
| quality | 压缩质量 | number | 80 | -  |
| size | 图片大小 | number | - | 单位MB |

#### videoFromData

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| maxDuration | 拍摄视频最长拍摄时间 | number |60| 最多60秒 |
| camera | 前摄像头后摄像头 | array | - |-  |
| compressed | 是否压缩所选的视频源文件。 | Boolean | true |-  |
| sourceType | 相册或者相机 | array |  ['camera ', 'album'] | ['camera ', 'album']  |
| size | 视频大小 | number | - | 单位MB |

#### listStyle

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| columns | 每行数量 | number |4| - |
| columnGap | 行间距 | string | '40rpx' |-  |
| rowGap | 列间距 | string | '40rpx' |-  |
| padding | 列表内边距 | string | '0 0rpx' |-  |
| ratio | 图片比例 | string | '1/1' | 低版本手机不支持,可以选择height属性  |
| height | 图片高度 | string | '140rpx' |-  |
| radius | 图片圆角 | string | '6rpx' |-  |

#### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onSuccess | 上传成功 | data: 服务器返回数据 |
| onError | 上传失败 | error:错误信息 |
| onImage | 点击图片 | item: 图片信息 index: 列表索引 |
| onVideo | 点击视频 | item: 视频信息 index: 列表索引 |
| onProgress | 上传进程 | onProgress参数说明|
| onVideoMax | 触发视频最大数量限制 | maxVideo, fileLength|
| onImageSize | 触发图片最大尺寸限制 | 图片信息 |
| beforeDelete | 删除前钩子 | item: 文件信息 index:文件索引 next:继续执行删除逻辑 |
| beforeUpload | 上传前钩子 | tempFile: 文件信息 next:继续执行删除逻辑 |

#### onProgress参数说明
| 事件名 | 说明 |
| --- | --- |
| progress | 上传进度百分比 |
| totalBytesSent | 已经上传的数据长度 |
| totalBytesExpectedToSend | 预期需要上传的数据总长度 |


### [遇到问题或者讨论 uniapp 加入QQ群  553291781](https://jq.qq.com/?_wv=1027&k=5UkMN1QX)