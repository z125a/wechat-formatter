// ============================================================
// 预设文章模板管理 — 富 HTML 内联样式成品模板
// ============================================================

/** 文章模板类型 */
export interface ArticleTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview?: string;  // 模板预览缩略描述
  content: string;   // Markdown + 富 HTML 内联样式
}

/** 模板分类 */
export const TEMPLATE_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'work', label: '💼 职场' },
  { key: 'life', label: '🌸 生活' },
  { key: 'marketing', label: '📣 营销' },
  { key: 'knowledge', label: '📚 知识' },
  { key: 'festival', label: '🎊 节日' },
] as const;

export type TemplateCategoryKey = (typeof TEMPLATE_CATEGORIES)[number]['key'];

// ============================================================
// 预设模板数据 — 每个模板都是精美的富 HTML 排版成品
// ============================================================

const PRESET_TEMPLATES: ArticleTemplate[] = [
  // ===== 职场类 =====
  {
    id: 'tech-share',
    name: '🔧 技术分享',
    category: 'work',
    description: '渐变标题 + 代码高亮 + 数据对比卡片',
    content: `<div style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px; letter-spacing: 1px;">🔧 技术分享标题</p>
<p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 0;">一句话概括核心内容</p>
</div>

<div style="background: #f0f4ff; border-left: 4px solid #667eea; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 15px; color: #4a5568; line-height: 1.8;">
💡 <strong style="color: #667eea;">导读：</strong>用一段话描述本文的核心价值，让读者快速了解能学到什么。
</div>

## 📌 背景

在日常开发中，我们经常遇到 **某某问题**，传统方案存在以下痛点：

<div style="display: flex; gap: 12px; margin: 16px 0;">
<div style="flex: 1; background: #fff5f5; padding: 14px; border-radius: 10px; border: 1px solid #fed7d7;">
<p style="margin: 0; font-size: 14px; color: #c53030;">❌ <strong>痛点一</strong></p>
<p style="margin: 6px 0 0; font-size: 13px; color: #666;">简要描述问题</p>
</div>
<div style="flex: 1; background: #fff5f5; padding: 14px; border-radius: 10px; border: 1px solid #fed7d7;">
<p style="margin: 0; font-size: 14px; color: #c53030;">❌ <strong>痛点二</strong></p>
<p style="margin: 6px 0 0; font-size: 13px; color: #666;">简要描述问题</p>
</div>
</div>

![配图](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&fit=crop&auto=format&q=80)

---

## 🎯 核心方案

\`\`\`javascript
// 核心代码示例
function solve(input) {
  const processed = preprocess(input);
  return coreLogic(processed);
}
\`\`\`

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 20px; border-radius: 10px; margin: 16px 0; color: #fff; font-size: 14px; line-height: 1.8;">
🔑 <strong style="color: #fff;">关键点：</strong>这里解释代码中最重要的设计决策和原因。
</div>

### 效果对比

<div style="display: flex; gap: 12px; margin: 16px 0;">
<div style="flex: 1; background: #f0fff4; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #c6f6d5;">
<p style="font-size: 32px; font-weight: 800; color: #22543d; margin: 0;">10x</p>
<p style="font-size: 12px; color: #666; margin: 4px 0 0;">性能提升</p>
</div>
<div style="flex: 1; background: #ebf8ff; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #bee3f8;">
<p style="font-size: 32px; font-weight: 800; color: #2a4365; margin: 0;">4x</p>
<p style="font-size: 12px; color: #666; margin: 4px 0 0;">内存优化</p>
</div>
<div style="flex: 1; background: #faf5ff; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #e9d8fd;">
<p style="font-size: 32px; font-weight: 800; color: #553c9a; margin: 0;">80%</p>
<p style="font-size: 12px; color: #666; margin: 4px 0 0;">代码精简</p>
</div>
</div>

---

## 📝 总结

- ✅ 解决了问题一
- ✅ 解决了问题二
- ✅ 解决了问题三

<div style="text-align: center; padding: 20px 0; margin-top: 20px; border-top: 1px dashed #e2e8f0;">
<p style="font-size: 13px; color: #999; margin: 0;">感谢阅读 · 欢迎点赞收藏转发 👍</p>
</div>
`,
  },
  {
    id: 'product-promo',
    name: '🚀 产品发布',
    category: 'marketing',
    description: '渐变头图 + 功能亮点卡片 + 用户评价',
    content: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 8px; letter-spacing: 3px;">✨ 全新发布</p>
<p style="font-size: 30px; font-weight: 800; color: #fff; margin: 0 0 12px;">产品名称</p>
<p style="font-size: 15px; color: rgba(255,255,255,0.85); margin: 0;">一句话核心卖点，让用户立刻心动</p>
</div>

![产品主图](https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&fit=crop&auto=format&q=80)

---

## 🌟 三大核心亮点

<div style="display: flex; gap: 12px; margin: 20px 0;">
<div style="flex: 1; background: linear-gradient(180deg, #ebf4ff 0%, #fff 100%); padding: 20px 16px; border-radius: 12px; text-align: center; border: 1px solid #bee3f8;">
<p style="font-size: 36px; margin: 0 0 8px;">💎</p>
<p style="font-weight: 700; font-size: 15px; color: #2b6cb0; margin: 0 0 6px;">功能一</p>
<p style="font-size: 12px; color: #718096; margin: 0; line-height: 1.6;">简要描述价值</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #f0fff4 0%, #fff 100%); padding: 20px 16px; border-radius: 12px; text-align: center; border: 1px solid #c6f6d5;">
<p style="font-size: 36px; margin: 0 0 8px;">⚡</p>
<p style="font-weight: 700; font-size: 15px; color: #276749; margin: 0 0 6px;">功能二</p>
<p style="font-size: 12px; color: #718096; margin: 0; line-height: 1.6;">简要描述价值</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #faf5ff 0%, #fff 100%); padding: 20px 16px; border-radius: 12px; text-align: center; border: 1px solid #e9d8fd;">
<p style="font-size: 36px; margin: 0 0 8px;">🎨</p>
<p style="font-weight: 700; font-size: 15px; color: #6b46c1; margin: 0 0 6px;">功能三</p>
<p style="font-size: 12px; color: #718096; margin: 0; line-height: 1.6;">简要描述价值</p>
</div>
</div>

---

## 💬 用户怎么说

<div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin: 12px 0; border: 1px solid #e2e8f0;">
<p style="font-size: 15px; color: #4a5568; margin: 0 0 10px; line-height: 1.8; font-style: italic;">"这款产品彻底改变了我的工作方式，效率提升了至少 3 倍。"</p>
<p style="font-size: 13px; color: #a0aec0; margin: 0; text-align: right;">—— <strong style="color: #718096;">用户A</strong>，产品经理</p>
</div>

<div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin: 12px 0; border: 1px solid #e2e8f0;">
<p style="font-size: 15px; color: #4a5568; margin: 0 0 10px; line-height: 1.8; font-style: italic;">"界面简洁，功能强大，上手零门槛。"</p>
<p style="font-size: 13px; color: #a0aec0; margin: 0; text-align: right;">—— <strong style="color: #718096;">用户B</strong>，独立开发者</p>
</div>

---

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 20px 0;">
<p style="font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 8px;">🎁 限时福利</p>
<p style="font-size: 14px; color: rgba(255,255,255,0.9); margin: 0;">新用户注册即送 7 天高级会员体验</p>
</div>

<div style="text-align: center; padding: 16px 0;">
<p style="font-size: 13px; color: #999; margin: 0;">关注我们，获取更多产品动态 📱</p>
</div>
`,
  },
  // ===== 生活类 =====
  {
    id: 'food-review',
    name: '🍜 美食探店',
    category: 'life',
    description: '暖色调头图 + 菜品卡片 + 评分星级',
    content: `<div style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">🍴 探店日记</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 10px;">这家隐藏小店，让我吃了三次</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">📍 XX路XX号 · 人均 ¥XX · ⭐ 4.8/5</p>
</div>

![餐厅环境](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&fit=crop&auto=format&q=80)

---

<div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
<p style="font-size: 14px; color: #92400e; margin: 0; line-height: 1.8;">🏠 <strong style="color: #92400e;">环境：</strong>木质桌椅搭配暖色灯光，温馨而不拥挤，适合朋友聚餐或情侣约会。</p>
</div>

## 🍽️ 必点菜品

<div style="display: flex; gap: 12px; margin: 16px 0;">
<div style="flex: 1; border-radius: 12px; overflow: hidden; border: 1px solid #fed7aa;">
<img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&fit=crop&auto=format&q=80" style="width: 100%; height: 120px; object-fit: cover; display: block;" />
<div style="padding: 12px; background: #fff;">
<p style="font-weight: 700; font-size: 14px; color: #c2410c; margin: 0 0 4px;">⭐ 招牌披萨</p>
<p style="font-size: 12px; color: #78716c; margin: 0; line-height: 1.5;">芝士拉丝超长，饼底酥脆</p>
<p style="font-size: 14px; font-weight: 700; color: #ea580c; margin: 6px 0 0;">¥68</p>
</div>
</div>
<div style="flex: 1; border-radius: 12px; overflow: hidden; border: 1px solid #fed7aa;">
<img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&fit=crop&auto=format&q=80" style="width: 100%; height: 120px; object-fit: cover; display: block;" />
<div style="padding: 12px; background: #fff;">
<p style="font-weight: 700; font-size: 14px; color: #c2410c; margin: 0 0 4px;">⭐ 鲜蔬沙拉</p>
<p style="font-size: 12px; color: #78716c; margin: 0; line-height: 1.5;">新鲜有机蔬菜，清爽解腻</p>
<p style="font-size: 14px; font-weight: 700; color: #ea580c; margin: 6px 0 0;">¥38</p>
</div>
</div>
</div>

---

## 💰 消费参考

| 菜品 | 价格 | 推荐度 |
|------|------|--------|
| 招牌披萨 | ¥68 | ⭐⭐⭐⭐⭐ |
| 鲜蔬沙拉 | ¥38 | ⭐⭐⭐⭐ |
| 特调饮品 | ¥28 | ⭐⭐⭐⭐ |

<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 16px 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
<p style="font-size: 14px; color: #7c2d12; margin: 0;">🗺️ 导航搜索「店名」| 🕐 营业 11:00-22:00 | 建议工作日去</p>
</div>

<p style="text-align: center; font-size: 13px; color: #999;">你去过这家店吗？评论区聊聊 🍴</p>
`,
  },
  {
    id: 'travel-guide',
    name: '✈️ 旅行攻略',
    category: 'life',
    description: '蓝色系头图 + 行程时间线 + 费用卡片',
    content: `<div style="background: linear-gradient(135deg, #0093E9 0%, #80D0C7 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 6px; letter-spacing: 3px;">✈️ 旅行攻略</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 10px;">目的地名称 · X天X夜完美行程</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">🗓️ 最佳时间 X-X月 · 💰 人均 ¥XXXX</p>
</div>

![目的地风景](https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&fit=crop&auto=format&q=80)

---

## 📋 行前清单

<div style="background: #f0f9ff; padding: 16px 20px; border-radius: 10px; margin: 16px 0; border: 1px solid #bae6fd;">
<p style="margin: 0 0 8px; font-size: 14px; color: #0369a1;">✅ 机票/车票：提前XX天预订</p>
<p style="margin: 0 0 8px; font-size: 14px; color: #0369a1;">✅ 住宿：推荐XX区域</p>
<p style="margin: 0 0 8px; font-size: 14px; color: #0369a1;">✅ 必备APP：地图、翻译、打车</p>
<p style="margin: 0; font-size: 14px; color: #0369a1;">✅ 必带：防晒霜、充电宝、舒适的鞋</p>
</div>

---

## 🗓️ 行程安排

<div style="border-left: 3px solid #0ea5e9; padding-left: 20px; margin: 16px 0;">
<div style="margin-bottom: 20px; position: relative;">
<div style="position: absolute; left: -28px; top: 2px; width: 14px; height: 14px; background: #0ea5e9; border-radius: 50%;"></div>
<p style="font-weight: 700; font-size: 16px; color: #0c4a6e; margin: 0 0 6px;">Day 1 · 到达 + 市区游览</p>
<p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.8;">上午抵达入住 → 下午景点A、景点B → 晚上美食街</p>
</div>
<div style="margin-bottom: 20px; position: relative;">
<div style="position: absolute; left: -28px; top: 2px; width: 14px; height: 14px; background: #0ea5e9; border-radius: 50%;"></div>
<p style="font-weight: 700; font-size: 16px; color: #0c4a6e; margin: 0 0 6px;">Day 2 · 核心景点</p>
<p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.8;">全天游览景点C（建议 4-5 小时）</p>
</div>
<div style="position: relative;">
<div style="position: absolute; left: -28px; top: 2px; width: 14px; height: 14px; background: #0ea5e9; border-radius: 50%;"></div>
<p style="font-weight: 700; font-size: 16px; color: #0c4a6e; margin: 0 0 6px;">Day 3 · 文化体验 + 返程</p>
<p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.8;">上午当地特色体验 → 下午购买伴手礼 → 返程</p>
</div>
</div>

![景点照片](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&fit=crop&auto=format&q=80)

---

## 💰 费用明细

<div style="display: flex; gap: 10px; margin: 16px 0; flex-wrap: wrap;">
<div style="flex: 1; min-width: 100px; background: #ecfdf5; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #a7f3d0;">
<p style="font-size: 20px; font-weight: 800; color: #065f46; margin: 0;">¥XXX</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">🚗 交通</p>
</div>
<div style="flex: 1; min-width: 100px; background: #eff6ff; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #bfdbfe;">
<p style="font-size: 20px; font-weight: 800; color: #1e40af; margin: 0;">¥XXX</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">🏨 住宿</p>
</div>
<div style="flex: 1; min-width: 100px; background: #fef3c7; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #fde68a;">
<p style="font-size: 20px; font-weight: 800; color: #92400e; margin: 0;">¥XXX</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">🍜 餐饮</p>
</div>
</div>

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">收藏这篇攻略，下次旅行用得上 🌍</p>
`,
  },
  {
    id: 'daily-essay',
    name: '📝 日常随笔',
    category: 'life',
    description: '文艺暖色调 + 引言卡片 + 配图排版',
    content: `<div style="background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 26px; font-weight: 700; color: #5b4636; margin: 0 0 12px; line-height: 1.4;">在平凡的日子里<br/>找到属于自己的光</p>
<p style="font-size: 13px; color: #a08060; margin: 0;">写于某年某月某日</p>
</div>

<div style="background: #fdf6ec; border-left: 4px solid #d4a574; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 20px 0;">
<p style="font-size: 15px; color: #8b6914; margin: 0; font-style: italic; line-height: 1.8;">
"在这里放一句触动你的话，作为文章的引子。也许是某本书里的句子，也许是某个人说过的话。"
</p>
</div>

![配图](https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&fit=crop&auto=format&q=80)

## 🌿 故事的开始

在某个平凡的日子里，发生了一件小事，让我突然有了一些感触。

也许你也有过类似的经历——在忙碌的生活中，突然被某个瞬间击中，然后开始思考一些平时不会想的事情。这就是生活中的故事，不需要多么戏剧化。

<p style="text-align: center; color: #d4a574; margin: 24px 0; font-size: 16px; letter-spacing: 8px;">🌿 🍃 🌿 🍃 🌿</p>

好的故事不需要多么跌宕起伏，真实就好。

有时候，生活中最打动人的，往往是那些不经意间的小细节：

<div style="background: #faf8f5; padding: 20px; border-radius: 12px; margin: 16px 0;">
<p style="font-size: 14px; color: #8b6914; margin: 0 0 10px; line-height: 1.8;">☀️ 清晨第一缕阳光透过窗帘的样子</p>
<p style="font-size: 14px; color: #8b6914; margin: 0 0 10px; line-height: 1.8;">☕ 路边咖啡店飘出的香气</p>
<p style="font-size: 14px; color: #8b6914; margin: 0; line-height: 1.8;">😊 陌生人一个善意的微笑</p>
</div>

<p style="text-align: center; color: #d4a574; margin: 24px 0; font-size: 16px; letter-spacing: 8px;">🌿 🍃 🌿 🍃 🌿</p>

<div style="background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); padding: 24px; border-radius: 12px; margin: 20px 0; text-align: center;">
<p style="font-size: 16px; color: #5b4636; margin: 0; line-height: 1.8; font-style: italic;">
生活不在别处，就在每一个当下。<br/>那些看似平淡的日子，其实都在悄悄发光。<br/>这是我最大的感悟。
</p>
</div>

<p style="text-align: center; font-size: 13px; color: #a08060; margin-top: 20px;">愿你也能在平凡的日子里，找到属于自己的小确幸 🌸</p>
`,
  },
  // ===== 节日类 =====
  {
    id: 'spring-festival',
    name: '🧧 春节祝福',
    category: 'festival',
    description: '红金配色 + 灯笼装饰 + 福利卡片',
    content: `<div style="background: linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center; position: relative;">
<p style="font-size: 40px; margin: 0 0 8px;">🏮🧧🎆🐉🎆🧧🏮</p>
<p style="font-size: 30px; font-weight: 800; color: #ffd700; margin: 0 0 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">新春快乐</p>
<p style="font-size: 15px; color: rgba(255,255,255,0.9); margin: 0;">龙年大吉 · 万事如意 · 阖家欢乐</p>
</div>

<div style="background: #fff9f0; border: 2px solid #ffd700; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
<p style="font-size: 16px; color: #c0392b; margin: 0; line-height: 2;">
亲爱的朋友们，值此新春佳节之际<br/>
向大家致以最诚挚的祝福！
</p>
</div>

<div style="display: flex; gap: 10px; margin: 20px 0;">
<div style="flex: 1; background: linear-gradient(180deg, #fff5f5 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fecaca;">
<p style="font-size: 28px; margin: 0 0 6px;">🌟</p>
<p style="font-weight: 700; font-size: 14px; color: #c0392b; margin: 0;">事业顺利</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #fefce8 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fde68a;">
<p style="font-size: 28px; margin: 0 0 6px;">💰</p>
<p style="font-weight: 700; font-size: 14px; color: #b45309; margin: 0;">财源广进</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #fef2f2 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fecaca;">
<p style="font-size: 28px; margin: 0 0 6px;">❤️</p>
<p style="font-weight: 700; font-size: 14px; color: #c0392b; margin: 0;">幸福安康</p>
</div>
</div>

---

## 🎁 新年福利

<div style="background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%); padding: 20px; border-radius: 12px; margin: 16px 0;">
<p style="font-size: 16px; font-weight: 700; color: #7c2d12; margin: 0 0 8px; text-align: center;">🔴 新年专属福利</p>
<p style="font-size: 14px; color: #92400e; margin: 0 0 6px;">🧧 福利一：XX优惠/礼品</p>
<p style="font-size: 14px; color: #92400e; margin: 0 0 6px;">🧧 福利二：XX优惠/礼品</p>
<p style="font-size: 14px; color: #92400e; margin: 0;">🧧 福利三：XX优惠/礼品</p>
</div>

<div style="text-align: center; padding: 24px 0; margin-top: 16px;">
<p style="font-size: 22px; color: #c0392b; font-weight: 800; margin: 0 0 6px;">🎆 恭贺新禧 · 阖家欢乐 🎆</p>
<p style="font-size: 13px; color: #999; margin: 0;">新的一年，新的开始，新的希望</p>
</div>
`,
  },
  {
    id: 'mid-autumn',
    name: '🥮 中秋节',
    category: 'festival',
    description: '深蓝月光色 + 月亮装饰 + 习俗卡片',
    content: `<div style="background: linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #283593 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 50px; margin: 0 0 8px;">🌕</p>
<p style="font-size: 28px; font-weight: 800; color: #ffd54f; margin: 0 0 8px; text-shadow: 0 2px 8px rgba(255,213,79,0.3);">中秋佳节</p>
<p style="font-size: 15px; color: rgba(255,255,255,0.8); margin: 0;">月圆人团圆 · 花好月圆夜</p>
</div>

<div style="background: #fffde7; border-left: 4px solid #ffd54f; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 20px 0;">
<p style="font-size: 15px; color: #5d4037; margin: 0; font-style: italic; line-height: 1.8;">
"但愿人长久，千里共婵娟。" —— 苏轼
</p>
</div>

![月亮](https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&fit=crop&auto=format&q=80)

---

## 🥮 中秋习俗

<div style="display: flex; gap: 10px; margin: 16px 0; flex-wrap: wrap;">
<div style="flex: 1; min-width: 120px; background: linear-gradient(180deg, #fffde7 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fff9c4;">
<p style="font-size: 32px; margin: 0 0 6px;">🌕</p>
<p style="font-weight: 700; font-size: 13px; color: #5d4037; margin: 0 0 4px;">赏月</p>
<p style="font-size: 11px; color: #8d6e63; margin: 0;">仰望明月</p>
</div>
<div style="flex: 1; min-width: 120px; background: linear-gradient(180deg, #fff3e0 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #ffe0b2;">
<p style="font-size: 32px; margin: 0 0 6px;">🥮</p>
<p style="font-weight: 700; font-size: 13px; color: #5d4037; margin: 0 0 4px;">吃月饼</p>
<p style="font-size: 11px; color: #8d6e63; margin: 0;">团圆象征</p>
</div>
<div style="flex: 1; min-width: 120px; background: linear-gradient(180deg, #fce4ec 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #f8bbd0;">
<p style="font-size: 32px; margin: 0 0 6px;">🏮</p>
<p style="font-weight: 700; font-size: 13px; color: #5d4037; margin: 0 0 4px;">赏花灯</p>
<p style="font-size: 11px; color: #8d6e63; margin: 0;">点亮夜空</p>
</div>
</div>

<div style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 20px 0;">
<p style="font-size: 20px; color: #ffd54f; font-weight: 700; margin: 0 0 6px;">花好月圆 · 阖家团圆</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0;">中秋快乐 🌕</p>
</div>
`,
  },
  // ===== 营销类 =====
  {
    id: 'sale-promo',
    name: '🛍️ 促销活动',
    category: 'marketing',
    description: '红色促销风 + 倒计时 + 爆款卡片',
    content: `<div style="background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">🔥 限时特惠</p>
<p style="font-size: 36px; font-weight: 900; color: #fff; margin: 0 0 8px;">全场低至 3 折</p>
<p style="font-size: 15px; color: #ffd700; margin: 0; font-weight: 600;">⏰ 仅剩 72 小时 · 错过再等一年</p>
</div>

## 🔥 爆款推荐

<div style="border: 2px solid #ff4b2b; border-radius: 12px; overflow: hidden; margin: 16px 0;">
<div style="background: #ff4b2b; padding: 8px 16px;">
<p style="font-size: 13px; color: #fff; margin: 0; font-weight: 700;">🏷️ 爆款一 · 限量抢购</p>
</div>
<div style="padding: 16px; background: #fff;">
<p style="font-size: 16px; font-weight: 700; color: #333; margin: 0 0 8px;">商品名称</p>
<p style="font-size: 13px; color: #999; margin: 0 0 8px; text-decoration: line-through;">原价：¥XXX</p>
<p style="font-size: 24px; font-weight: 900; color: #ff4b2b; margin: 0;">¥XX <span style="font-size: 12px; font-weight: 400; color: #999;">起</span></p>
</div>
</div>

<div style="border: 2px solid #ff416c; border-radius: 12px; overflow: hidden; margin: 16px 0;">
<div style="background: #ff416c; padding: 8px 16px;">
<p style="font-size: 13px; color: #fff; margin: 0; font-weight: 700;">🏷️ 爆款二 · 人气之选</p>
</div>
<div style="padding: 16px; background: #fff;">
<p style="font-size: 16px; font-weight: 700; color: #333; margin: 0 0 8px;">商品名称</p>
<p style="font-size: 13px; color: #999; margin: 0 0 8px; text-decoration: line-through;">原价：¥XXX</p>
<p style="font-size: 24px; font-weight: 900; color: #ff416c; margin: 0;">¥XX <span style="font-size: 12px; font-weight: 400; color: #999;">起</span></p>
</div>
</div>

---

## 🎁 满减优惠

<div style="display: flex; gap: 8px; margin: 16px 0;">
<div style="flex: 1; background: #fff5f5; padding: 12px; border-radius: 10px; text-align: center; border: 2px dashed #ff4b2b;">
<p style="font-size: 18px; font-weight: 800; color: #ff4b2b; margin: 0;">满100减20</p>
</div>
<div style="flex: 1; background: #fff5f5; padding: 12px; border-radius: 10px; text-align: center; border: 2px dashed #ff416c;">
<p style="font-size: 18px; font-weight: 800; color: #ff416c; margin: 0;">满200减50</p>
</div>
<div style="flex: 1; background: #fff5f5; padding: 12px; border-radius: 10px; text-align: center; border: 2px dashed #e91e63;">
<p style="font-size: 18px; font-weight: 800; color: #e91e63; margin: 0;">满500减150</p>
</div>
</div>

<div style="background: #333; padding: 16px; border-radius: 10px; margin: 20px 0; text-align: center;">
<p style="font-size: 14px; color: #ffd700; margin: 0; font-weight: 600;">👉 长按识别二维码，立即抢购 · 手慢无 🏃‍♂️</p>
</div>
`,
  },
  // ===== 知识类 =====
  {
    id: 'knowledge-card',
    name: '📚 知识卡片',
    category: 'knowledge',
    description: '清新蓝绿 + 知识点卡片 + 总结框',
    content: `<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">📚 知识卡片</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">今天学到了什么？</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">每天进步一点点</p>
</div>

## 📖 知识点一

<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
<p style="font-weight: 700; font-size: 15px; color: #166534; margin: 0 0 8px;">💡 核心概念</p>
<p style="font-size: 14px; color: #4a5568; margin: 0; line-height: 1.8;">在这里解释第一个知识点的核心内容，用简洁的语言让读者快速理解。</p>
</div>

## 📖 知识点二

<div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
<p style="font-weight: 700; font-size: 15px; color: #1e40af; margin: 0 0 8px;">💡 核心概念</p>
<p style="font-size: 14px; color: #4a5568; margin: 0; line-height: 1.8;">在这里解释第二个知识点，可以配合例子说明。</p>
</div>

---

## ✅ 今日总结

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 12px; margin: 16px 0;">
<p style="font-size: 14px; color: #fff; margin: 0 0 6px;">✅ 知识点一：一句话总结</p>
<p style="font-size: 14px; color: #fff; margin: 0 0 6px;">✅ 知识点二：一句话总结</p>
<p style="font-size: 14px; color: #fff; margin: 0;">✅ 知识点三：一句话总结</p>
</div>

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">点赞收藏，每天学一点 📚</p>
`,
  },
  {
    id: 'weekly-report',
    name: '📊 周报总结',
    category: 'work',
    description: '商务蓝 + 数据卡片 + 进度条',
    content: `<div style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 6px; letter-spacing: 3px;">📊 工作周报</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">第 XX 周工作总结</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">XX月XX日 — XX月XX日</p>
</div>

## 📈 本周数据

<div style="display: flex; gap: 10px; margin: 16px 0;">
<div style="flex: 1; background: #eff6ff; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #bfdbfe;">
<p style="font-size: 28px; font-weight: 800; color: #1e40af; margin: 0;">12</p>
<p style="font-size: 12px; color: #6b7280; margin: 4px 0 0;">完成任务</p>
</div>
<div style="flex: 1; background: #f0fdf4; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #bbf7d0;">
<p style="font-size: 28px; font-weight: 800; color: #166534; margin: 0;">95%</p>
<p style="font-size: 12px; color: #6b7280; margin: 4px 0 0;">完成率</p>
</div>
<div style="flex: 1; background: #fef3c7; padding: 16px; border-radius: 10px; text-align: center; border: 1px solid #fde68a;">
<p style="font-size: 28px; font-weight: 800; color: #92400e; margin: 0;">3</p>
<p style="font-size: 12px; color: #6b7280; margin: 4px 0 0;">待跟进</p>
</div>
</div>

---

## ✅ 本周完成

- 完成了项目A的核心功能开发
- 修复了X个线上问题
- 完成了需求评审和技术方案设计

## 🔄 进行中

<div style="background: #f8fafc; padding: 16px; border-radius: 10px; margin: 12px 0; border: 1px solid #e2e8f0;">
<p style="font-size: 14px; color: #334155; margin: 0 0 8px;">📌 项目B — 预计下周完成</p>
<div style="background: #e2e8f0; border-radius: 6px; height: 8px; overflow: hidden;">
<div style="background: linear-gradient(90deg, #3b82f6, #2563eb); width: 70%; height: 100%; border-radius: 6px;"></div>
</div>
<p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0; text-align: right;">70%</p>
</div>

## 📅 下周计划

- 完成项目B剩余功能
- 启动项目C的技术调研
- 团队代码评审

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">以上为本周工作总结 📊</p>
`,
  },
  {
    id: 'book-review',
    name: '📖 读书笔记',
    category: 'knowledge',
    description: '文艺棕色调 + 书籍信息卡 + 金句摘录',
    content: `<div style="background: linear-gradient(135deg, #3c1053 0%, #ad5389 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 6px; letter-spacing: 3px;">📖 读书笔记</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">《书名》</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">作者名 · 出版年份</p>
</div>

## 📋 书籍信息

<div style="display: flex; gap: 12px; margin: 16px 0;">
<div style="flex: 1; background: #faf5ff; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #e9d5ff;">
<p style="font-size: 13px; color: #7c3aed; margin: 0;">⭐ 推荐指数</p>
<p style="font-size: 18px; font-weight: 700; color: #5b21b6; margin: 4px 0 0;">⭐⭐⭐⭐⭐</p>
</div>
<div style="flex: 1; background: #fdf4ff; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #f5d0fe;">
<p style="font-size: 13px; color: #a21caf; margin: 0;">📄 页数</p>
<p style="font-size: 18px; font-weight: 700; color: #86198f; margin: 4px 0 0;">XXX 页</p>
</div>
<div style="flex: 1; background: #fef2f2; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #fecaca;">
<p style="font-size: 13px; color: #dc2626; margin: 0;">⏱️ 阅读时长</p>
<p style="font-size: 18px; font-weight: 700; color: #b91c1c; margin: 4px 0 0;">X 小时</p>
</div>
</div>

---

## 💎 金句摘录

<div style="background: #faf5ff; border-left: 4px solid #a855f7; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 16px 0;">
<p style="font-size: 15px; color: #6b21a8; margin: 0; font-style: italic; line-height: 1.8;">"在这里写下书中最打动你的一句话。"</p>
</div>

<div style="background: #fdf4ff; border-left: 4px solid #d946ef; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 16px 0;">
<p style="font-size: 15px; color: #86198f; margin: 0; font-style: italic; line-height: 1.8;">"第二句金句摘录。"</p>
</div>

## 📝 读后感

这本书让我印象最深的是……

---

## ✅ 行动清单

- 把书中的方法应用到工作中
- 推荐给身边的朋友
- 下一本计划阅读《XX》

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">好书值得分享，你读过这本吗？📖</p>
`,
  },
  {
    id: 'fitness-plan',
    name: '💪 健身打卡',
    category: 'life',
    description: '活力橙绿 + 运动数据 + 饮食卡片',
    content: `<div style="background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">💪 健身打卡</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">Day XX · 今日训练记录</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.9); margin: 0;">坚持就是胜利 🏆</p>
</div>

## 🏋️ 今日训练

<div style="display: flex; gap: 10px; margin: 16px 0;">
<div style="flex: 1; background: #fff7ed; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #fed7aa;">
<p style="font-size: 24px; font-weight: 800; color: #c2410c; margin: 0;">45</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">⏱️ 分钟</p>
</div>
<div style="flex: 1; background: #fef3c7; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #fde68a;">
<p style="font-size: 24px; font-weight: 800; color: #92400e; margin: 0;">350</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">🔥 千卡</p>
</div>
<div style="flex: 1; background: #f0fdf4; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #bbf7d0;">
<p style="font-size: 24px; font-weight: 800; color: #166534; margin: 0;">5</p>
<p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">📋 组数</p>
</div>
</div>

### 训练内容

| 动作 | 组数 | 次数 | 重量 |
|------|------|------|------|
| 深蹲 | 4 | 12 | 60kg |
| 硬拉 | 4 | 10 | 80kg |
| 卧推 | 3 | 12 | 50kg |

---

## 🥗 今日饮食

<div style="background: #f0fdf4; padding: 16px; border-radius: 10px; margin: 12px 0; border: 1px solid #bbf7d0;">
<p style="font-size: 14px; color: #166534; margin: 0 0 6px;">🌅 早餐：全麦面包 + 鸡蛋 + 牛奶</p>
<p style="font-size: 14px; color: #166534; margin: 0 0 6px;">☀️ 午餐：鸡胸肉 + 糙米 + 西兰花</p>
<p style="font-size: 14px; color: #166534; margin: 0;">🌙 晚餐：三文鱼 + 沙拉</p>
</div>

<div style="background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%); padding: 16px; border-radius: 10px; text-align: center; margin: 20px 0;">
<p style="font-size: 15px; font-weight: 700; color: #fff; margin: 0;">🔥 累计打卡 XX 天 · 继续加油！</p>
</div>
`,
  },
  {
    id: 'brand-story',
    name: '🏢 品牌故事',
    category: 'marketing',
    description: '高级灰金 + 品牌时间线 + 数据展示',
    content: `<div style="background: linear-gradient(135deg, #232526 0%, #414345 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: #d4af37; margin: 0 0 8px; letter-spacing: 4px;">BRAND STORY</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">品牌名称</p>
<p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 0;">一句话品牌理念</p>
</div>

![品牌形象](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop&auto=format&q=80)

## 📖 我们的故事

一切始于一个简单的想法……

<div style="border-left: 3px solid #d4af37; padding-left: 20px; margin: 20px 0;">
<div style="margin-bottom: 16px;">
<p style="font-weight: 700; font-size: 15px; color: #d4af37; margin: 0 0 4px;">2018 · 创立</p>
<p style="font-size: 13px; color: #64748b; margin: 0;">品牌成立，开始了第一步</p>
</div>
<div style="margin-bottom: 16px;">
<p style="font-weight: 700; font-size: 15px; color: #d4af37; margin: 0 0 4px;">2020 · 突破</p>
<p style="font-size: 13px; color: #64748b; margin: 0;">用户突破10万，获得A轮融资</p>
</div>
<div>
<p style="font-weight: 700; font-size: 15px; color: #d4af37; margin: 0 0 4px;">2024 · 今天</p>
<p style="font-size: 13px; color: #64748b; margin: 0;">服务全球用户，持续创新</p>
</div>
</div>

---

## 📊 品牌数据

<div style="display: flex; gap: 10px; margin: 16px 0;">
<div style="flex: 1; background: #1a1a2e; padding: 16px; border-radius: 10px; text-align: center;">
<p style="font-size: 28px; font-weight: 800; color: #d4af37; margin: 0;">100W+</p>
<p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0;">用户数</p>
</div>
<div style="flex: 1; background: #1a1a2e; padding: 16px; border-radius: 10px; text-align: center;">
<p style="font-size: 28px; font-weight: 800; color: #d4af37; margin: 0;">50+</p>
<p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0;">城市覆盖</p>
</div>
<div style="flex: 1; background: #1a1a2e; padding: 16px; border-radius: 10px; text-align: center;">
<p style="font-size: 28px; font-weight: 800; color: #d4af37; margin: 0;">99%</p>
<p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0;">好评率</p>
</div>
</div>

<div style="background: linear-gradient(135deg, #d4af37 0%, #f5d060 100%); padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
<p style="font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0;">与我们一起，创造更好的未来</p>
</div>
`,
  },
  {
    id: 'mothers-day',
    name: '💐 母亲节',
    category: 'festival',
    description: '粉色温馨 + 感恩卡片 + 花朵装饰',
    content: `<div style="background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 40px; margin: 0 0 8px;">💐🌸🌷💕🌷🌸💐</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">母亲节快乐</p>
<p style="font-size: 15px; color: rgba(255,255,255,0.9); margin: 0;">感恩有你 · 爱在心间</p>
</div>

<div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 20px 0;">
<p style="font-size: 15px; color: #9d174d; margin: 0; font-style: italic; line-height: 1.8;">
"世界上有一种最美丽的声音，那便是母亲的呼唤。" —— 但丁
</p>
</div>

![母亲节](https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&fit=crop&auto=format&q=80)

## 💝 给妈妈的话

亲爱的妈妈，谢谢你一直以来的付出和陪伴……

<div style="display: flex; gap: 10px; margin: 20px 0;">
<div style="flex: 1; background: linear-gradient(180deg, #fdf2f8 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fbcfe8;">
<p style="font-size: 28px; margin: 0 0 6px;">🌹</p>
<p style="font-weight: 700; font-size: 14px; color: #be185d; margin: 0;">健康平安</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #faf5ff 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e9d5ff;">
<p style="font-size: 28px; margin: 0 0 6px;">💖</p>
<p style="font-weight: 700; font-size: 14px; color: #7c3aed; margin: 0;">幸福快乐</p>
</div>
<div style="flex: 1; background: linear-gradient(180deg, #fdf2f8 0%, #fff 100%); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #fbcfe8;">
<p style="font-size: 28px; margin: 0 0 6px;">✨</p>
<p style="font-weight: 700; font-size: 14px; color: #be185d; margin: 0;">永远年轻</p>
</div>
</div>

<div style="background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 20px 0;">
<p style="font-size: 20px; color: #fff; font-weight: 700; margin: 0 0 6px;">妈妈，我爱你 💕</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.8); margin: 0;">Happy Mother's Day</p>
</div>
`,
  },
  {
    id: 'tutorial-guide',
    name: '📝 教程指南',
    category: 'knowledge',
    description: '步骤卡片 + 代码块 + 提示框',
    content: `<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">📝 手把手教程</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">教程标题</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">难度：⭐⭐ · 预计 XX 分钟</p>
</div>

<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 16px 0;">
<p style="font-size: 14px; color: #1e40af; margin: 0; line-height: 1.8;">📌 <strong style="color: #1e40af;">前置条件：</strong>列出读者需要提前准备的环境或知识。</p>
</div>

## 第一步：准备工作

详细描述第一步需要做什么……

<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 12px 0;">
<p style="font-size: 13px; color: #166534; margin: 0;">💡 <strong>小提示：</strong>这里放一些有用的小技巧。</p>
</div>

## 第二步：核心操作

详细描述核心步骤……

## 第三步：验证结果

如何确认操作成功……

---

<div style="background: #fef3c7; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
<p style="font-size: 14px; color: #92400e; margin: 0; line-height: 1.8;">⚠️ <strong style="color: #92400e;">常见问题：</strong>如果遇到XX错误，请检查XX设置。</p>
</div>

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">觉得有用？转发给需要的朋友 📝</p>
`,
  },
  {
    id: 'interview-qa',
    name: '🎤 人物访谈',
    category: 'work',
    description: '对话气泡 + 人物卡片 + 金句高亮',
    content: `<div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 40px 30px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
<p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 6px; letter-spacing: 3px;">🎤 人物专访</p>
<p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 8px;">对话嘉宾姓名</p>
<p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0;">嘉宾头衔 / 一句话介绍</p>
</div>

## 👤 嘉宾简介

<div style="display: flex; gap: 16px; margin: 16px 0; align-items: center;">
<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #a18cd1, #fbc2eb); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
<span style="font-size: 36px;">👤</span>
</div>
<div>
<p style="font-weight: 700; font-size: 16px; color: #333; margin: 0 0 4px;">嘉宾姓名</p>
<p style="font-size: 13px; color: #666; margin: 0; line-height: 1.6;">XX公司创始人，XX领域专家，曾获得XX荣誉。</p>
</div>
</div>

---

## 💬 精彩对话

<div style="background: #f3e8ff; padding: 14px 18px; border-radius: 12px 12px 12px 0; margin: 12px 0; max-width: 85%;">
<p style="font-size: 13px; color: #7c3aed; margin: 0 0 4px; font-weight: 600;">Q：主持人</p>
<p style="font-size: 14px; color: #4a5568; margin: 0; line-height: 1.8;">请问您是如何开始这段创业之旅的？</p>
</div>

<div style="background: #eff6ff; padding: 14px 18px; border-radius: 12px 12px 0 12px; margin: 12px 0 12px auto; max-width: 85%;">
<p style="font-size: 13px; color: #2563eb; margin: 0 0 4px; font-weight: 600;">A：嘉宾</p>
<p style="font-size: 14px; color: #4a5568; margin: 0; line-height: 1.8;">一切源于一个偶然的机会……</p>
</div>

<div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
<p style="font-size: 15px; color: #fff; margin: 0; font-style: italic; line-height: 1.8; text-align: center;">"金句：嘉宾说的最有价值的一句话"</p>
</div>

<p style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">更多精彩访谈，敬请关注 🎤</p>
`,
  },
];

// ============================================================
// 导出函数
// ============================================================

/** 获取所有预设模板 */
export function getPresetTemplates(): ArticleTemplate[] {
  return PRESET_TEMPLATES;
}

/** 按分类获取模板 */
export function getTemplatesByCategory(category: string): ArticleTemplate[] {
  if (category === 'all') return PRESET_TEMPLATES;
  return PRESET_TEMPLATES.filter((t) => t.category === category);
}

/** 按 ID 获取单个模板 */
export function getTemplate(id: string): ArticleTemplate | undefined {
  return PRESET_TEMPLATES.find((t) => t.id === id);
}
