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

type TabType = 'image' | 'divider' | 'emoji' | 'text-block' | 'gif' | 'sticker' | 'color';

const TABS: { key: TabType; label: string }[] = [
  { key: 'image', label: '🖼️ 图片' },
  { key: 'gif', label: '🎬 动图' },
  { key: 'sticker', label: '🐱 表情包' },
  { key: 'divider', label: '✂️ 分割线' },
  { key: 'emoji', label: '😀 Emoji' },
  { key: 'text-block', label: '📝 文字块' },
  { key: 'color', label: '🎨 配色' },
];

const EMOJI_CATEGORY_NAMES: Record<EmojiCategory, string> = {
  faces: '表情', gestures: '手势', animals: '动物', food: '食物',
  travel: '交通', objects: '物品', symbols: '符号',
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

  const [selectedStickerTag, setSelectedStickerTag] = useState<string>('全部');

  if (!open) return null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const pillStyle = (selected: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: selected ? 600 : 400,
    border: '1px solid',
    borderColor: selected ? 'var(--primary)' : 'var(--border)',
    borderRadius: 'var(--radius-full)',
    background: selected ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
    color: selected ? 'var(--primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const cardStyle: React.CSSProperties = {
    cursor: 'pointer',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface)',
    transition: 'all 150ms ease',
  };

  const renderImageTab = () => {
    const categories = getImageCategories();
    const images = getImagesByCategory(selectedImageCategory);
    const filteredImages = searchQuery.trim()
      ? (() => {
          const filtered = searchAssets('image' as AssetCategory, searchQuery);
          const ids = new Set(filtered.map((a) => a.id));
          return images.filter((img) => ids.has(img.id));
        })()
      : images;

    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {categories.map((cat) => (
            <button key={cat} data-testid={`image-category-${cat}`}
              onClick={() => setSelectedImageCategory(cat)}
              style={pillStyle(selectedImageCategory === cat)}>
              {IMAGE_CATEGORY_NAMES[cat]}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {filteredImages.map((img) => (
            <div key={img.id} data-testid={`image-item-${img.id}`}
              onClick={() => onInsert(buildImageMarkdown(img.fullUrl, img.alt))}
              style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                border: '1px solid var(--border)', background: 'var(--surface-dim)',
                transition: 'all 150ms ease' }}
              title={img.name}>
              {failedImages.has(img.id) ? (
                <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'var(--surface-hover)', color: 'var(--text-muted)',
                  fontSize: '11px' }}>
                  加载失败
                </div>
              ) : (
                <img src={img.thumbnailUrl} alt={img.alt}
                  style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  onError={() => setFailedImages((prev) => new Set(prev).add(img.id))} />
              )}
              <div style={{ padding: '5px 8px', fontSize: '11px', color: 'var(--text-secondary)',
                textAlign: 'center', fontWeight: 500 }}>
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDividerTab = () => {
    const items = searchQuery.trim()
      ? searchAssets('divider', searchQuery) : getAssetsByCategory('divider');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div key={item.id} data-testid={`divider-item-${item.id}`}
            onClick={() => onInsert(item.content)} style={cardStyle} title={item.name}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              {item.name}
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.preview || item.content }} />
          </div>
        ))}
      </div>
    );
  };

  const renderEmojiTab = () => {
    const allEmojis = searchQuery.trim()
      ? searchAssets('emoji', searchQuery) : getAssetsByCategory('emoji');
    const filteredEmojis = searchQuery.trim()
      ? allEmojis : allEmojis.filter((item) => item.tags.includes(selectedEmojiCategory));
    return (
      <div>
        {!searchQuery.trim() && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {EMOJI_CATEGORIES.map((cat) => (
              <button key={cat} data-testid={`emoji-category-${cat}`}
                onClick={() => setSelectedEmojiCategory(cat)}
                style={pillStyle(selectedEmojiCategory === cat)}>
                {EMOJI_CATEGORY_NAMES[cat]}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px' }}>
          {filteredEmojis.map((item) => (
            <button key={item.id} data-testid={`emoji-item-${item.id}`}
              onClick={() => onInsert(item.content)} title={item.name}
              style={{ fontSize: '24px', padding: '8px 4px', border: '1px solid transparent',
                borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer',
                textAlign: 'center', transition: 'background 120ms ease' }}>
              {item.content}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTextBlockTab = () => {
    const items = searchQuery.trim()
      ? searchAssets('text-block', searchQuery) : getAssetsByCategory('text-block');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div key={item.id} data-testid={`text-block-item-${item.id}`}
            onClick={() => onInsert(item.content)} style={cardStyle} title={item.name}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              {item.name}
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.preview || item.content }} />
          </div>
        ))}
      </div>
    );
  };

  const renderGifTab = () => {
    const items = searchQuery.trim()
      ? searchAssets('gif', searchQuery) : getAssetsByCategory('gif');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {items.map((item) => (
          <div key={item.id} data-testid={`gif-item-${item.id}`}
            onClick={() => onInsert(item.content)}
            style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden',
              border: '1px solid var(--border)', background: 'var(--surface-dim)',
              transition: 'all 150ms ease' }}
            title={item.name}>
            <div dangerouslySetInnerHTML={{ __html: item.preview || '' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '70px', background: 'var(--surface-hover)' }} />
            <div style={{ padding: '5px 8px', fontSize: '11px', color: 'var(--text-secondary)',
              textAlign: 'center', fontWeight: 500 }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const STICKER_TAGS = ['全部', '卡通', '反应', '日常', '祝福', '动物'];

  const renderStickerTab = () => {
    const allItems = searchQuery.trim()
      ? searchAssets('sticker', searchQuery) : getAssetsByCategory('sticker');
    const items = searchQuery.trim() || selectedStickerTag === '全部'
      ? allItems
      : allItems.filter((item) => item.tags.some((t) => t === selectedStickerTag));
    return (
      <div>
        {!searchQuery.trim() && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {STICKER_TAGS.map((tag) => (
              <button key={tag}
                onClick={() => setSelectedStickerTag(tag)}
                style={pillStyle(selectedStickerTag === tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {items.map((item) => (
            <div key={item.id} data-testid={`sticker-item-${item.id}`}
              onClick={() => onInsert(item.content)}
              style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                border: '1px solid var(--border)', background: 'var(--surface-dim)',
                transition: 'all 150ms ease', textAlign: 'center' }}
              title={item.name}>
              <div dangerouslySetInnerHTML={{ __html: item.preview || '' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '70px', background: 'var(--surface-hover)' }} />
              <div style={{ padding: '3px 4px', fontSize: '10px', color: 'var(--text-secondary)',
                fontWeight: 500 }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const COLOR_SCHEMES = [
    { name: '科技蓝', colors: ['#0f172a', '#1e40af', '#3b82f6', '#93c5fd', '#dbeafe'] },
    { name: '自然绿', colors: ['#14532d', '#166534', '#22c55e', '#86efac', '#dcfce7'] },
    { name: '暖阳橙', colors: ['#7c2d12', '#c2410c', '#f97316', '#fdba74', '#fff7ed'] },
    { name: '优雅紫', colors: ['#3b0764', '#6b21a8', '#a855f7', '#d8b4fe', '#f5f3ff'] },
    { name: '玫瑰红', colors: ['#881337', '#be123c', '#f43f5e', '#fda4af', '#fff1f2'] },
    { name: '海洋青', colors: ['#134e4a', '#0d9488', '#2dd4bf', '#99f6e4', '#f0fdfa'] },
    { name: '金色年华', colors: ['#78350f', '#b45309', '#f59e0b', '#fcd34d', '#fefce8'] },
    { name: '深邃靛', colors: ['#1e1b4b', '#3730a3', '#6366f1', '#a5b4fc', '#eef2ff'] },
    { name: '森林棕', colors: ['#422006', '#713f12', '#a16207', '#d4a574', '#fdf6ec'] },
    { name: '樱花粉', colors: ['#831843', '#be185d', '#ec4899', '#f9a8d4', '#fdf2f8'] },
    { name: '极光绿', colors: ['#052e16', '#15803d', '#4ade80', '#bbf7d0', '#f0fdf4'] },
    { name: '星空灰', colors: ['#111827', '#374151', '#6b7280', '#d1d5db', '#f9fafb'] },
  ];

  const renderColorTab = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {COLOR_SCHEMES.map((scheme) => (
          <div key={scheme.name} style={{ ...cardStyle, padding: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{scheme.name}</div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {scheme.colors.map((c, i) => (
                <div key={i} style={{ flex: 1, height: '32px', background: c, borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.08)' }}
                  title={`点击复制 ${c}`}
                  onClick={() => { navigator.clipboard.writeText(c).catch(() => {}); }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {scheme.colors.map((c, i) => (
                <span key={i} style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', cursor: 'pointer' }}
                  onClick={() => { navigator.clipboard.writeText(c).catch(() => {}); }}>
                  {c}
                </span>
              ))}
            </div>
            <button onClick={() => {
              const html = `<div style="display: flex; gap: 4px; margin: 12px 0;">${scheme.colors.map((c) => `<div style="flex: 1; height: 40px; background: ${c}; border-radius: 6px;"></div>`).join('')}</div>`;
              onInsert(html);
            }} style={{ marginTop: '6px', width: '100%', padding: '5px', fontSize: '11px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface-dim)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              插入色卡
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'image': return renderImageTab();
      case 'divider': return renderDividerTab();
      case 'emoji': return renderEmojiTab();
      case 'text-block': return renderTextBlockTab();
      case 'gif': return renderGifTab();
      case 'sticker': return renderStickerTab();
      case 'color': return renderColorTab();
      default: return null;
    }
  };

  return (
    <div data-testid="asset-panel" style={{
      position: 'fixed', top: 0, right: 0, width: '340px', height: '100vh',
      background: 'var(--surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
      zIndex: 1200, display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 250ms ease forwards',
      borderLeft: '1px solid var(--border)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: '6px' }}>
          🎨 素材库
        </span>
        <button data-testid="asset-panel-close" onClick={onClose} aria-label="关闭素材库"
          style={{ border: 'none', background: 'var(--surface-hover)', width: '28px', height: '28px',
            borderRadius: 'var(--radius-sm)', fontSize: '16px', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'all 150ms ease' }}>
          ×
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 18px 8px' }}>
        <input data-testid="asset-search-input" type="text" placeholder="🔍 搜索素材..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '9px 14px', fontSize: '13px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            outline: 'none', boxSizing: 'border-box', background: 'var(--surface-dim)',
            color: 'var(--text)', transition: 'border-color 150ms ease' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', padding: '0 18px',
        borderBottom: '1px solid var(--border)' }}>
        {TABS.map((tab) => (
          <button key={tab.key} data-testid={`asset-tab-${tab.key}`}
            onClick={() => handleTabChange(tab.key)}
            style={{ flex: 1, padding: '10px 4px', fontSize: '12px', border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 150ms ease' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}
