type CurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name'

/**
 * 显示消息提示框
 * @param content 提示的标题
 */
export function toast(title: string = '数据加载失败...', icon: any = 'none') {
  uni.showToast({
    title,
    icon,
    mask: true,
  })
}

export const getCurrentTime = () => {
  return new Date().getTime()
}

/**
 * 显示模态弹窗
 * @param content 提示的标题
 */
export function showConfirm(content: any) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: content,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        resolve(res)
      },
    })
  })
}

// 防抖函数
export const debounce = (
  fn: (...args: any[]) => void,
  delay: number,
): ((...args: any[]) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// 判断是否为空
export const isDef = (val: any) => {
  return val !== null && val !== undefined
}

// 深拷贝
export function deepClone<T>(source: T): T {
  if (source === undefined || source === null || typeof source !== 'object') {
    throw new Error('Invalid argument for deepClone')
  }

  // 使用类型断言来处理数组或对象
  const targetObj: T = Array.isArray(source) ? ([] as unknown as T) : ({} as T)

  // 使用Object.keys保证只复制自有的、可枚举的属性
  Object.keys(source).forEach((key) => {
    // 必须将key转换成类型更具体的keyof T
    const specificKey = key as keyof T
    // 需要用any来处理source的索引签名
    const value = (source as any)[specificKey]

    if (value && typeof value === 'object') {
      // 使用断言来保证返回的类型与T一致
      ;(targetObj as any)[specificKey] = deepClone(value)
    } else {
      ;(targetObj as any)[specificKey] = value
    }
  })

  return targetObj
}

// 货币显示格式（formatCurrency(mitem.price)）
export function formatCurrency(value: any, withOutCom: boolean = true, digits: number = 2): string {
  if (withOutCom) {
    return parseFloat(value).toFixed(digits)
  }

  return '￥' + parseFloat(value).toFixed(digits)
}

/**
 * 获取底部安全距离
 * @param defaultValue 默认值
 */
export function getSafeAreaInsetsBottom(defaultValue: number) {
  const data = uni.getSystemInfoSync()
  if ((data.safeAreaInsets?.bottom || 0) > 0) {
    return data.safeAreaInsets?.bottom
  } else {
    return defaultValue
  }
}

/**
 * 获取顶部安全距离
 * @param defaultValue 默认值
 */
export function getSafeAreaInsetsTop(defaultValue: number = 0) {
  const data = uni.getSystemInfoSync()
  if ((data.safeAreaInsets?.top || 0) > 0) {
    return data.safeAreaInsets?.top
  } else {
    return defaultValue
  }
}

/**
 * 获取屏幕左侧安全距离
 * @param defaultValue 默认值
 */
export function getSafeAreaInsetsStart(defaultValue: number = 0) {
  const data = uni.getSystemInfoSync()
  if ((data.safeAreaInsets?.left || 0) > 0) {
    return data.safeAreaInsets?.left
  } else {
    return defaultValue
  }
}

/**
 * 复制内容
 * @param value 值
 */
export function copyData(value: string) {
  uni.setClipboardData({
    data: value,
    success: function () {
      toast('复制成功')
    },
  })
}

/**
 * 日期格式化函数
 * @param date 日期对象
 * @param format 日期格式，默认为 YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 获取年月日时分秒，通过 padStart 补 0
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化后的结果
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const convertFenToYuan = (fen: number) => {
  return fen / 100
}

export const removeExtraZerosSimple = (num: number) => {
  return Number(num.toFixed(20))
}
export const postMessage = (actionName: string, data: any) => {
  webUni.postMessage({
    data: {
      action: actionName,
      body: data,
    },
  })
}

/**
 * 字符串是否为空
 * @param value 字符串
 */
export function isEmptyString(value: string | null | undefined): boolean {
  return !value || value.trim() === ''
}

/**
 * 字符串是否不为空
 * @param value 字符串
 */
export function isNotEmptyString(value: string | null | undefined): boolean {
  return !isEmptyString(value)
}

/**
 * 获取不为空的字符串
 * @param value 字符串
 * @param defaultValue 默认值
 */
export function getNotEmptyString(value: string | null | undefined, defaultValue: string = '') {
  return isNotEmptyString(value) ? value : defaultValue
}
