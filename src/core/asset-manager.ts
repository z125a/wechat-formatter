import type { AssetCategory, AssetItem, ImageAsset, ImageCategory } from '../types';
import { DIVIDERS, EMOJIS, IMAGE_ASSETS, TEXT_BLOCKS } from './asset-data';
import { buildImageMarkdown } from './image-inserter';

/**
 * 将 Emoji 项转换为统一的 AssetItem 格式。
 */
function emojiToAssetItem(emoji: { char: string; name: string; category: string }): AssetItem {
  return {
    id: `emoji-${emoji.char}`,
    name: emoji.name,
    category: 'emoji',
    tags: [emoji.name, emoji.category],
    content: emoji.char,
  };
}

/**
 * 将图片素材转换为统一的 AssetItem 格式。
 */
function imageToAssetItem(image: ImageAsset): AssetItem {
  return {
    id: image.id,
    name: image.name,
    category: 'image',
    tags: [image.name, image.category, image.alt],
    content: buildImageMarkdown(image.fullUrl, image.alt),
    preview: image.thumbnailUrl,
  };
}

/**
 * 获取指定分类的素材列表。
 */
export function getAssetsByCategory(category: AssetCategory): AssetItem[] {
  switch (category) {
    case 'divider':
      return DIVIDERS;
    case 'text-block':
      return TEXT_BLOCKS;
    case 'emoji':
      return EMOJIS.map(emojiToAssetItem);
    case 'image':
      return Object.values(IMAGE_ASSETS).flat().map(imageToAssetItem);
    default:
      return [];
  }
}

/**
 * 按关键词搜索素材（匹配名称和标签，不区分大小写）。
 * 空或纯空白查询返回该分类的全部素材。
 */
export function searchAssets(category: AssetCategory, query: string): AssetItem[] {
  const assets = getAssetsByCategory(category);
  const trimmed = query.trim();
  if (trimmed === '') {
    return assets;
  }
  const lower = trimmed.toLowerCase();
  return assets.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lower)),
  );
}

/**
 * 获取所有图片分类值。
 */
export function getImageCategories(): ImageCategory[] {
  return Object.keys(IMAGE_ASSETS) as ImageCategory[];
}

/**
 * 获取指定图片分类的图片素材列表。
 */
export function getImagesByCategory(category: ImageCategory): ImageAsset[] {
  return IMAGE_ASSETS[category] ?? [];
}

/**
 * 构建素材插入内容——返回素材的 content 字符串。
 */
export function buildAssetContent(asset: AssetItem): string {
  return asset.content;
}
