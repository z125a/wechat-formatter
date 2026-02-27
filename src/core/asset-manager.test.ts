import { describe, expect, it } from 'vitest';
import {
  buildAssetContent,
  getAssetsByCategory,
  getImageCategories,
  getImagesByCategory,
  searchAssets,
} from './asset-manager';
import { DIVIDERS, EMOJIS, IMAGE_ASSETS, TEXT_BLOCKS } from './asset-data';

describe('getAssetsByCategory', () => {
  it('returns dividers for "divider" category', () => {
    const result = getAssetsByCategory('divider');
    expect(result).toEqual(DIVIDERS);
    expect(result.length).toBeGreaterThanOrEqual(8);
    result.forEach((item) => expect(item.category).toBe('divider'));
  });

  it('returns text blocks for "text-block" category', () => {
    const result = getAssetsByCategory('text-block');
    expect(result).toEqual(TEXT_BLOCKS);
    result.forEach((item) => expect(item.category).toBe('text-block'));
  });

  it('returns emojis converted to AssetItem for "emoji" category', () => {
    const result = getAssetsByCategory('emoji');
    expect(result.length).toBe(EMOJIS.length);
    result.forEach((item) => {
      expect(item.category).toBe('emoji');
      expect(item.content).toBeTruthy();
      expect(item.id).toMatch(/^emoji-/);
    });
  });

  it('returns images converted to AssetItem for "image" category', () => {
    const result = getAssetsByCategory('image');
    const totalImages = Object.values(IMAGE_ASSETS).flat().length;
    expect(result.length).toBe(totalImages);
    result.forEach((item) => {
      expect(item.category).toBe('image');
      expect(item.content).toContain('![');
    });
  });
});

describe('searchAssets', () => {
  it('returns all assets when query is empty', () => {
    const all = getAssetsByCategory('divider');
    const result = searchAssets('divider', '');
    expect(result).toEqual(all);
  });

  it('returns all assets when query is whitespace only', () => {
    const all = getAssetsByCategory('divider');
    const result = searchAssets('divider', '   ');
    expect(result).toEqual(all);
  });

  it('filters by name (case-insensitive)', () => {
    const result = searchAssets('divider', '波浪');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].name).toContain('波浪');
  });

  it('filters by tag (case-insensitive)', () => {
    const result = searchAssets('divider', 'DOTTED');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].tags.some((t) => t.toLowerCase().includes('dotted'))).toBe(true);
  });

  it('returns empty array when nothing matches', () => {
    const result = searchAssets('divider', 'zzzznonexistent');
    expect(result).toEqual([]);
  });

  it('searches emojis by name', () => {
    const result = searchAssets('emoji', '笑脸');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].name).toContain('笑脸');
  });
});

describe('getImageCategories', () => {
  it('returns all 7 image categories', () => {
    const categories = getImageCategories();
    expect(categories).toContain('technology');
    expect(categories).toContain('business');
    expect(categories).toContain('nature');
    expect(categories).toContain('food');
    expect(categories).toContain('city');
    expect(categories).toContain('people');
    expect(categories).toContain('abstract');
    expect(categories.length).toBe(7);
  });
});

describe('getImagesByCategory', () => {
  it('returns images for a valid category', () => {
    const images = getImagesByCategory('technology');
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => expect(img.category).toBe('technology'));
  });

  it('returns images for each category', () => {
    const categories = getImageCategories();
    categories.forEach((cat) => {
      const images = getImagesByCategory(cat);
      expect(images.length).toBeGreaterThan(0);
    });
  });
});

describe('buildAssetContent', () => {
  it('returns the content string of a divider asset', () => {
    const divider = DIVIDERS[0];
    expect(buildAssetContent(divider)).toBe(divider.content);
  });

  it('returns the content string of a text-block asset', () => {
    const block = TEXT_BLOCKS[0];
    expect(buildAssetContent(block)).toBe(block.content);
  });

  it('returns the emoji char for an emoji asset', () => {
    const emojiAssets = getAssetsByCategory('emoji');
    const first = emojiAssets[0];
    expect(buildAssetContent(first)).toBe(first.content);
    // The content should be the emoji character
    expect(first.content).toBe(EMOJIS[0].char);
  });

  it('returns markdown image syntax for an image asset', () => {
    const imageAssets = getAssetsByCategory('image');
    const first = imageAssets[0];
    const content = buildAssetContent(first);
    expect(content).toContain('![');
    expect(content).toContain('](');
  });
});
