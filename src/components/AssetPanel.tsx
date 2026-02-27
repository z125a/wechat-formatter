import { useState } from 'react';
import type { AssetCategory, ImageCategory, EmojiCategory } from '../types';
import {
  getAssetsByCategory,
  searchAssets,
  getImageCategories,
  getImagesByCategory,
} from '../core/asset-manager';
import { IMAGE_CATEGORY_NAMES } from '../core/asset-data';
import { buildImageMarkdown } from '../core/image-inserter';

export interface AssetPanelProps {
  open: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

type TabType = 'image' | 'divider' | 'emoji' | 'text-block';

const TABS: { key: TabType; label: string }[] = [
  { key: 'image', label: '📷 图片' },
  { key: 'divider', label: '✂️ 分割线' },
  { key: 'emoji', label: '😀 Emoji' },
  { key: 'text-block', label: '📝 文字块' },
];

const EMOJI_CATEGORY_NAMES: Record<EmojiCategory, string> = {
  faces: '表情',
  gestures: '手势',
  animals: '动物',
  food: '食物',
  travel: '交通',
  objects: '物品',
  symbols: '符号',
};

const EMOJI_CATEGORIES: EmojiCategory[] = [
  'faces', 'gestures', 'animals', 'food', 'travel', 'objects', 'symbols',
];

export function AssetPanel({ open, onClose, onInsert }: AssetPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<ImageCategory>('technology');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<EmojiCategory>('faces');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (!open) return null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // --- Image Tab Content (5.2) ---
  const renderImageTab = () => {
    const categories = getImageCategories();
    const images = getImagesByCategory(selectedImageCategory);

    // Filter images via search if query is present
    const filteredImages = searchQuery.trim()
      ? (() => {
          const filtered = searchAssets('image' as AssetCategory, searchQuery);
          const filteredIds = new Set(filtered.map((a) => a.id));
          return images.filter((img) => filteredIds.has(img.id));
        })()
      : images;

    return (
      <div>
        {/* Sub-category selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              data-testid={`image-category-${cat}`}
              onClick={() => setSelectedImageCategory(cat)}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                border: '1px solid',
                borderColor: selectedImageCategory === cat ? '#1976d2' : '#ddd',
                borderRadius: '14px',
                background: selectedImageCategory === cat ? '#e3f2fd' : '#fff',
                color: selectedImageCategory === cat ? '#1976d2' : '#666',
                cursor: 'pointer',
              }}
            >
              {IMAGE_CATEGORY_NAMES[cat]}
            </button>
          ))}
        </div>
        {/* Thumbnail grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {filteredImages.map((img) => (
            <div
              key={img.id}
              data-testid={`image-item-${img.id}`}
              onClick={() => onInsert(buildImageMarkdown(img.fullUrl, img.alt))}
              style={{
                cursor: 'pointer',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #eee',
                background: '#f5f5f5',
              }}
              title={img.name}
            >
              {failedImages.has(img.id) ? (
                <div
                  style={{
                    width: '100%',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e0e0e0',
                    color: '#999',
                    fontSize: '12px',
                  }}
                >
                  加载失败
                </div>
              ) : (
                <img
                  src={img.thumbnailUrl}
                  alt={img.alt}
                  style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  onError={() => setFailedImages((prev) => new Set(prev).add(img.id))}
                />
              )}
              <div style={{ padding: '4px 6px', fontSize: '11px', color: '#555', textAlign: 'center' }}>
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Divider Tab Content (5.3) ---
  const renderDividerTab = () => {
    const items = searchQuery.trim()
      ? searchAssets('divider', searchQuery)
      : getAssetsByCategory('divider');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            data-testid={`divider-item-${item.id}`}
            onClick={() => onInsert(item.content)}
            style={{
              cursor: 'pointer',
              padding: '8px 10px',
              border: '1px solid #eee',
              borderRadius: '6px',
              background: '#fff',
            }}
            title={item.name}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{item.name}</div>
            <div
              dangerouslySetInnerHTML={{ __html: item.preview || item.content }}
            />
          </div>
        ))}
      </div>
    );
  };

  // --- Emoji Tab Content (5.4) ---
  const renderEmojiTab = () => {
    const allEmojis = searchQuery.trim()
      ? searchAssets('emoji', searchQuery)
      : getAssetsByCategory('emoji');

    // Filter by selected emoji category
    const filteredEmojis = searchQuery.trim()
      ? allEmojis
      : allEmojis.filter((item) => item.tags.includes(selectedEmojiCategory));

    return (
      <div>
        {/* Sub-category selector */}
        {!searchQuery.trim() && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat}
                data-testid={`emoji-category-${cat}`}
                onClick={() => setSelectedEmojiCategory(cat)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  border: '1px solid',
                  borderColor: selectedEmojiCategory === cat ? '#1976d2' : '#ddd',
                  borderRadius: '14px',
                  background: selectedEmojiCategory === cat ? '#e3f2fd' : '#fff',
                  color: selectedEmojiCategory === cat ? '#1976d2' : '#666',
                  cursor: 'pointer',
                }}
              >
                {EMOJI_CATEGORY_NAMES[cat]}
              </button>
            ))}
          </div>
        )}
        {/* Emoji grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {filteredEmojis.map((item) => (
            <button
              key={item.id}
              data-testid={`emoji-item-${item.id}`}
              onClick={() => onInsert(item.content)}
              title={item.name}
              style={{
                fontSize: '22px',
                padding: '6px',
                border: '1px solid transparent',
                borderRadius: '6px',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {item.content}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- Text Block Tab Content (5.5) ---
  const renderTextBlockTab = () => {
    const items = searchQuery.trim()
      ? searchAssets('text-block', searchQuery)
      : getAssetsByCategory('text-block');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            data-testid={`text-block-item-${item.id}`}
            onClick={() => onInsert(item.content)}
            style={{
              cursor: 'pointer',
              padding: '8px 10px',
              border: '1px solid #eee',
              borderRadius: '6px',
              background: '#fff',
            }}
            title={item.name}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{item.name}</div>
            <div
              dangerouslySetInnerHTML={{ __html: item.preview || item.content }}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'image':
        return renderImageTab();
      case 'divider':
        return renderDividerTab();
      case 'emoji':
        return renderEmojiTab();
      case 'text-block':
        return renderTextBlockTab();
      default:
        return null;
    }
  };

  return (
    <div
      data-testid="asset-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        background: '#fafafa',
        boxShadow: '-2px 0 12px rgba(0,0,0,0.12)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 250ms ease forwards',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid #e0e0e0',
          background: '#fff',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>素材库</span>
        <button
          data-testid="asset-panel-close"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999',
            padding: '0 4px',
            lineHeight: 1,
          }}
          aria-label="关闭素材库"
        >
          ×
        </button>
      </div>

      {/* Search input (5.6) */}
      <div style={{ padding: '10px 16px 6px' }}>
        <input
          data-testid="asset-search-input"
          type="text"
          placeholder="搜索素材..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tab buttons */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '6px 16px 0',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            data-testid={`asset-tab-${tab.key}`}
            onClick={() => handleTabChange(tab.key)}
            style={{
              flex: 1,
              padding: '8px 4px',
              fontSize: '12px',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #1976d2' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === tab.key ? '#1976d2' : '#666',
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}
