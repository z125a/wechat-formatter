import type { StorageData } from '../types';

const STORAGE_KEY = 'wechat-formatter-data';
const DEBOUNCE_MS = 2000;

/**
 * StorageService - 封装 localStorage 操作，提供类型安全的存取接口。
 * 包含 2 秒防抖自动保存逻辑。
 */
export class StorageService {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** 检查 localStorage 是否可用 */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /** 保存数据到 localStorage */
  save(data: StorageData): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch {
      // quota exceeded or other write error
      return false;
    }
  }

  /** 从 localStorage 加载数据 */
  load(): StorageData | null {
    if (!this.isAvailable()) {
      return null;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return null;
      }
      return JSON.parse(raw) as StorageData;
    } catch {
      return null;
    }
  }

  /** 清除存储数据 */
  clear(): void {
    if (!this.isAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * 防抖自动保存 - 2 秒内多次调用只执行最后一次。
   * 返回值表示是否成功调度（不代表已保存）。
   */
  debouncedSave(data: StorageData): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.save(data);
      this.debounceTimer = null;
    }, DEBOUNCE_MS);
  }

  /** 取消待执行的防抖保存 */
  cancelPendingDebounce(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}

/** 单例实例 */
export const storageService = new StorageService();
