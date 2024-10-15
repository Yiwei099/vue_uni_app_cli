import config from '@/config'

/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */

const isDevelopment = () => {
  //自主判断
  return process.env.NODE_ENV === 'development'
  // 固定正式服
  // return false
  //固定测试服
  // return true
}

export const baseURL = isDevelopment() ? config.devBaseURL : config.baseURLClothing
export const baseURLRestaurant = isDevelopment() ? config.devBaseURL : config.baseURL

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时, 默认 10s
    options.timeout = 10000
    // 5. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'token': uni.getStorageSync('token'),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept-language': 'zh-CN',
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.content
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */
type Data<T> = {
  code: number
  msg: string
  data: T
  content: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // console.log("res",res)
        // 状态码 2xx， axios 就是这样设计的
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.content
          const tempData = res.data as Data<T>
          if (tempData.code == 0) {
            resolve(tempData.data || tempData.content)
          } else {
            reject(res)
          }
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          reject(res)
        } else if (res.statusCode === 404) {
          // 404
          uni.showToast({
            icon: 'none',
            title: '服务器接口无效',
          })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
