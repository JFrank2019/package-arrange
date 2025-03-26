import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T>(updaterOrValue: T | ((prev: T) => T), ref: Ref<T>) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? (updaterOrValue as (prev: T) => T)(ref.value)
      : updaterOrValue
}

/**
 * 创建Apple风格的过渡效果类
 * @param customClass - 自定义类
 * @returns 包含Apple风格过渡效果的类名
 */
export function appleTransition(customClass: string = '') {
  return cn('apple-transition', customClass)
}

/**
 * 创建Apple风格的阴影效果类
 * @param customClass - 自定义类
 * @returns 包含Apple风格阴影效果的类名
 */
export function appleShadow(customClass: string = '') {
  return cn('apple-shadow', customClass)
}
