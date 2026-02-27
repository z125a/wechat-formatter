// ============================================================
// Image Inserter — 图片插入核心逻辑
// ============================================================

/**
 * 构建 Markdown 图片语法。
 *
 * @param url - 图片 URL
 * @param alt - 可选的替代文本，默认为空字符串
 * @returns `![alt](url)` 格式字符串
 */
export function buildImageMarkdown(url: string, alt: string = ''): string {
  return `![${alt}](${url})`;
}

/**
 * 验证图片 URL 是否有效（非空白字符串）。
 *
 * @param url - 待验证的 URL 字符串
 * @returns 当 URL 包含至少一个非空白字符时返回 true
 */
export function isValidImageUrl(url: string): boolean {
  return url.trim().length > 0;
}

/**
 * 在指定位置插入文本。
 *
 * @param content - 原始内容
 * @param position - 插入位置（0-based 索引）
 * @param text - 要插入的文本
 * @returns 插入后的新字符串
 */
export function insertAtCursor(content: string, position: number, text: string): string {
  const pos = Math.max(0, Math.min(position, content.length));
  return content.slice(0, pos) + text + content.slice(pos);
}

/**
 * 将图片文件转换为 Base64 Data URL。
 *
 * @param file - 图片文件对象
 * @returns Promise，resolve 为 `data:image/...;base64,...` 格式字符串
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}
