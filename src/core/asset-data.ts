import type { AssetItem, EmojiItem, ImageAsset, ImageCategory } from '../types';

// ============================================================
// 分割线素材
// ============================================================

export const DIVIDERS: AssetItem[] = [
  {
    id: 'divider-dotted',
    name: '虚线分割',
    category: 'divider',
    tags: ['虚线', 'dotted', '简约'],
    content: '\n<hr style="border: none; border-top: 2px dotted #ccc; margin: 20px 0;" />\n',
    preview: '<hr style="border: none; border-top: 2px dotted #ccc; margin: 10px 0;" />',
  },
  {
    id: 'divider-wave',
    name: '波浪线分割',
    category: 'divider',
    tags: ['波浪', 'wave', '曲线'],
    content: '\n<p style="text-align: center; color: #999; margin: 20px 0; font-size: 20px; letter-spacing: 8px;">〰〰〰〰〰〰〰〰</p>\n',
    preview: '<p style="text-align: center; color: #999; margin: 10px 0; font-size: 16px; letter-spacing: 6px;">〰〰〰〰〰〰〰〰</p>',
  },
  {
    id: 'divider-gradient',
    name: '渐变线分割',
    category: 'divider',
    tags: ['渐变', 'gradient', '彩色'],
    content: '\n<div style="height: 2px; margin: 20px 0; background: linear-gradient(to right, transparent, #667eea, #764ba2, transparent);"></div>\n',
    preview: '<div style="height: 2px; margin: 10px 0; background: linear-gradient(to right, transparent, #667eea, #764ba2, transparent);"></div>',
  },
  {
    id: 'divider-star',
    name: '星星分割',
    category: 'divider',
    tags: ['星星', 'star', '装饰'],
    content: '\n<p style="text-align: center; color: #f0c040; margin: 20px 0; font-size: 16px; letter-spacing: 12px;">✦ ✦ ✦ ✦ ✦</p>\n',
    preview: '<p style="text-align: center; color: #f0c040; margin: 10px 0; font-size: 14px; letter-spacing: 10px;">✦ ✦ ✦ ✦ ✦</p>',
  },
  {
    id: 'divider-flower',
    name: '花朵分割',
    category: 'divider',
    tags: ['花朵', 'flower', '可爱'],
    content: '\n<p style="text-align: center; color: #e91e63; margin: 20px 0; font-size: 16px; letter-spacing: 10px;">❀ ❀ ❀ ❀ ❀</p>\n',
    preview: '<p style="text-align: center; color: #e91e63; margin: 10px 0; font-size: 14px; letter-spacing: 8px;">❀ ❀ ❀ ❀ ❀</p>',
  },
  {
    id: 'divider-arrow',
    name: '箭头分割',
    category: 'divider',
    tags: ['箭头', 'arrow', '方向'],
    content: '\n<p style="text-align: center; color: #607d8b; margin: 20px 0; font-size: 16px; letter-spacing: 8px;">▸ ▸ ▸ ▸ ▸ ▸ ▸</p>\n',
    preview: '<p style="text-align: center; color: #607d8b; margin: 10px 0; font-size: 14px; letter-spacing: 6px;">▸ ▸ ▸ ▸ ▸ ▸ ▸</p>',
  },
  {
    id: 'divider-diamond',
    name: '菱形分割',
    category: 'divider',
    tags: ['菱形', 'diamond', '几何'],
    content: '\n<p style="text-align: center; color: #9c27b0; margin: 20px 0; font-size: 14px; letter-spacing: 10px;">◆ ◇ ◆ ◇ ◆ ◇ ◆</p>\n',
    preview: '<p style="text-align: center; color: #9c27b0; margin: 10px 0; font-size: 12px; letter-spacing: 8px;">◆ ◇ ◆ ◇ ◆ ◇ ◆</p>',
  },
  {
    id: 'divider-rainbow',
    name: '彩虹分割',
    category: 'divider',
    tags: ['彩虹', 'rainbow', '多彩'],
    content: '\n<div style="height: 4px; margin: 20px 0; background: linear-gradient(to right, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff);"></div>\n',
    preview: '<div style="height: 3px; margin: 10px 0; background: linear-gradient(to right, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff);"></div>',
  },
];

// ============================================================
// 文字装饰块素材
// ============================================================

export const TEXT_BLOCKS: AssetItem[] = [
  {
    id: 'block-info',
    name: '信息提示框',
    category: 'text-block',
    tags: ['提示', 'info', '蓝色', '信息'],
    content: '\n<div style="background: #e3f2fd; border-left: 4px solid #1976d2; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #1565c0; font-size: 14px;">💡 <strong style="color: #1565c0;">提示：</strong>在此输入提示内容</div>\n',
    preview: '<div style="background: #e3f2fd; border-left: 4px solid #1976d2; padding: 8px 12px; border-radius: 4px; color: #1565c0; font-size: 12px;">💡 <strong style="color: #1565c0;">提示：</strong>在此输入提示内容</div>',
  },
  {
    id: 'block-warning',
    name: '警告提示框',
    category: 'text-block',
    tags: ['警告', 'warning', '黄色', '注意'],
    content: '\n<div style="background: #fff3e0; border-left: 4px solid #f57c00; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #e65100; font-size: 14px;">⚠️ <strong style="color: #e65100;">注意：</strong>在此输入警告内容</div>\n',
    preview: '<div style="background: #fff3e0; border-left: 4px solid #f57c00; padding: 8px 12px; border-radius: 4px; color: #e65100; font-size: 12px;">⚠️ <strong style="color: #e65100;">注意：</strong>在此输入警告内容</div>',
  },
  {
    id: 'block-success',
    name: '成功提示框',
    category: 'text-block',
    tags: ['成功', 'success', '绿色', '完成'],
    content: '\n<div style="background: #e8f5e9; border-left: 4px solid #388e3c; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #2e7d32; font-size: 14px;">✅ <strong style="color: #2e7d32;">成功：</strong>在此输入成功内容</div>\n',
    preview: '<div style="background: #e8f5e9; border-left: 4px solid #388e3c; padding: 8px 12px; border-radius: 4px; color: #2e7d32; font-size: 12px;">✅ <strong style="color: #2e7d32;">成功：</strong>在此输入成功内容</div>',
  },
  {
    id: 'block-error',
    name: '错误提示框',
    category: 'text-block',
    tags: ['错误', 'error', '红色', '失败'],
    content: '\n<div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #c62828; font-size: 14px;">❌ <strong style="color: #c62828;">错误：</strong>在此输入错误内容</div>\n',
    preview: '<div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 8px 12px; border-radius: 4px; color: #c62828; font-size: 12px;">❌ <strong style="color: #c62828;">错误：</strong>在此输入错误内容</div>',
  },
  {
    id: 'block-steps',
    name: '编号步骤块',
    category: 'text-block',
    tags: ['步骤', 'steps', '编号', '流程'],
    content: '\n<div style="background: #f5f5f5; padding: 16px 20px; margin: 16px 0; border-radius: 8px; font-size: 14px; color: #333;"><div style="margin-bottom: 10px;"><span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background: #1976d2; color: #fff; border-radius: 50%; font-size: 12px; margin-right: 8px;">1</span><strong style="color: #333;">第一步：</strong>描述步骤内容</div><div style="margin-bottom: 10px;"><span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background: #1976d2; color: #fff; border-radius: 50%; font-size: 12px; margin-right: 8px;">2</span><strong style="color: #333;">第二步：</strong>描述步骤内容</div><div><span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background: #1976d2; color: #fff; border-radius: 50%; font-size: 12px; margin-right: 8px;">3</span><strong style="color: #333;">第三步：</strong>描述步骤内容</div></div>\n',
    preview: '<div style="background: #f5f5f5; padding: 8px 12px; border-radius: 6px; font-size: 11px; color: #333;"><span style="display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; background: #1976d2; color: #fff; border-radius: 50%; font-size: 10px; margin-right: 4px;">1</span> 第一步 → <span style="display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; background: #1976d2; color: #fff; border-radius: 50%; font-size: 10px; margin-right: 4px;">2</span> 第二步 → ...</div>',
  },
  {
    id: 'block-quote-highlight',
    name: '高亮引用块',
    category: 'text-block',
    tags: ['引用', 'quote', '高亮', '名言'],
    content: '\n<div style="border-left: 4px solid #ff6f00; background: #fff8e1; padding: 16px 20px; margin: 16px 0; border-radius: 0 8px 8px 0; font-size: 15px; color: #555; font-style: italic; line-height: 1.8;">「在此输入引用内容，可以是名言、金句或重要观点。」<div style="text-align: right; margin-top: 8px; font-size: 13px; color: #999; font-style: normal;">—— 作者名</div></div>\n',
    preview: '<div style="border-left: 3px solid #ff6f00; background: #fff8e1; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 11px; color: #555; font-style: italic;">「引用内容...」</div>',
  },
  {
    id: 'block-callout',
    name: '标注框',
    category: 'text-block',
    tags: ['标注', 'callout', '重点', '注释'],
    content: '\n<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 24px; margin: 16px 0; border-radius: 8px; color: #fff; font-size: 15px; line-height: 1.8;"><div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #fff;">📌 重点标注</div><div style="color: rgba(255,255,255,0.9);">在此输入需要重点标注的内容，支持多行文本。</div></div>\n',
    preview: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px 12px; border-radius: 6px; color: #fff; font-size: 11px;">📌 <strong style="color: #fff;">重点标注</strong></div>',
  },
];

// ============================================================
// Emoji 数据
// ============================================================

export const EMOJIS: EmojiItem[] = [
  // 表情 (faces)
  { char: '😀', name: '笑脸', category: 'faces' },
  { char: '😃', name: '大笑', category: 'faces' },
  { char: '😄', name: '开心', category: 'faces' },
  { char: '😁', name: '嘻嘻', category: 'faces' },
  { char: '😆', name: '斜眼笑', category: 'faces' },
  { char: '😅', name: '苦笑', category: 'faces' },
  { char: '🤣', name: '笑哭', category: 'faces' },
  { char: '😂', name: '喜极而泣', category: 'faces' },
  { char: '🙂', name: '微笑', category: 'faces' },
  { char: '😊', name: '害羞', category: 'faces' },
  { char: '😇', name: '天使', category: 'faces' },
  { char: '🥰', name: '喜爱', category: 'faces' },

  // 手势 (gestures)
  { char: '👍', name: '点赞', category: 'gestures' },
  { char: '👎', name: '踩', category: 'gestures' },
  { char: '👏', name: '鼓掌', category: 'gestures' },
  { char: '🙌', name: '举手', category: 'gestures' },
  { char: '🤝', name: '握手', category: 'gestures' },
  { char: '✌️', name: '胜利', category: 'gestures' },
  { char: '🤞', name: '祈祷', category: 'gestures' },
  { char: '👌', name: 'OK', category: 'gestures' },
  { char: '🤙', name: '打电话', category: 'gestures' },
  { char: '👋', name: '挥手', category: 'gestures' },
  { char: '✋', name: '停止', category: 'gestures' },
  { char: '🖐️', name: '张开手', category: 'gestures' },

  // 动物 (animals)
  { char: '🐶', name: '狗', category: 'animals' },
  { char: '🐱', name: '猫', category: 'animals' },
  { char: '🐭', name: '老鼠', category: 'animals' },
  { char: '🐹', name: '仓鼠', category: 'animals' },
  { char: '🐰', name: '兔子', category: 'animals' },
  { char: '🦊', name: '狐狸', category: 'animals' },
  { char: '🐻', name: '熊', category: 'animals' },
  { char: '🐼', name: '熊猫', category: 'animals' },
  { char: '🐨', name: '考拉', category: 'animals' },
  { char: '🐯', name: '老虎', category: 'animals' },
  { char: '🦁', name: '狮子', category: 'animals' },
  { char: '🐮', name: '牛', category: 'animals' },

  // 食物 (food)
  { char: '🍎', name: '苹果', category: 'food' },
  { char: '🍐', name: '梨', category: 'food' },
  { char: '🍊', name: '橘子', category: 'food' },
  { char: '🍋', name: '柠檬', category: 'food' },
  { char: '🍌', name: '香蕉', category: 'food' },
  { char: '🍉', name: '西瓜', category: 'food' },
  { char: '🍇', name: '葡萄', category: 'food' },
  { char: '🍓', name: '草莓', category: 'food' },
  { char: '🫐', name: '蓝莓', category: 'food' },
  { char: '🍒', name: '樱桃', category: 'food' },
  { char: '🍑', name: '桃子', category: 'food' },
  { char: '🥝', name: '猕猴桃', category: 'food' },

  // 交通 (travel)
  { char: '✈️', name: '飞机', category: 'travel' },
  { char: '🚗', name: '汽车', category: 'travel' },
  { char: '🚕', name: '出租车', category: 'travel' },
  { char: '🚌', name: '公交车', category: 'travel' },
  { char: '🚎', name: '电车', category: 'travel' },
  { char: '🏎️', name: '赛车', category: 'travel' },
  { char: '🚓', name: '警车', category: 'travel' },
  { char: '🚑', name: '救护车', category: 'travel' },
  { char: '🚒', name: '消防车', category: 'travel' },
  { char: '🚐', name: '面包车', category: 'travel' },
  { char: '🛻', name: '皮卡', category: 'travel' },
  { char: '🚚', name: '货车', category: 'travel' },

  // 物品 (objects)
  { char: '💻', name: '笔记本', category: 'objects' },
  { char: '📱', name: '手机', category: 'objects' },
  { char: '⌨️', name: '键盘', category: 'objects' },
  { char: '🖥️', name: '台式机', category: 'objects' },
  { char: '🖨️', name: '打印机', category: 'objects' },
  { char: '📷', name: '相机', category: 'objects' },
  { char: '📹', name: '摄像机', category: 'objects' },
  { char: '🎥', name: '电影', category: 'objects' },
  { char: '📺', name: '电视', category: 'objects' },
  { char: '📻', name: '收音机', category: 'objects' },
  { char: '🔋', name: '电池', category: 'objects' },
  { char: '💡', name: '灯泡', category: 'objects' },

  // 符号 (symbols)
  { char: '❤️', name: '红心', category: 'symbols' },
  { char: '🧡', name: '橙心', category: 'symbols' },
  { char: '💛', name: '黄心', category: 'symbols' },
  { char: '💚', name: '绿心', category: 'symbols' },
  { char: '💙', name: '蓝心', category: 'symbols' },
  { char: '💜', name: '紫心', category: 'symbols' },
  { char: '🖤', name: '黑心', category: 'symbols' },
  { char: '🤍', name: '白心', category: 'symbols' },
  { char: '✨', name: '闪光', category: 'symbols' },
  { char: '⭐', name: '星星', category: 'symbols' },
  { char: '🌟', name: '发光星', category: 'symbols' },
  { char: '💫', name: '头晕', category: 'symbols' },
];

// ============================================================
// 图片分类与 Unsplash URL 构建
// ============================================================

/** 图片分类中文名映射 */
export const IMAGE_CATEGORY_NAMES: Record<ImageCategory, string> = {
  technology: '科技',
  business: '商务',
  nature: '自然',
  food: '美食',
  city: '城市',
  people: '人物',
  abstract: '抽象',
};

/**
 * 构建 Lorem Picsum 图片 URL。
 * 使用固定 seed 保证同一素材每次返回相同图片。
 */
export function buildPicsumUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/** 根据 seed 构建图片素材 */
function buildImageAsset(
  category: ImageCategory,
  id: string,
  name: string,
  seed: string,
  alt: string,
): ImageAsset {
  return {
    id,
    name,
    category,
    thumbnailUrl: buildPicsumUrl(seed, 400, 300),
    fullUrl: buildPicsumUrl(seed, 1080, 720),
    alt,
  };
}

/** 所有图片分类的预定义素材 */
export const IMAGE_ASSETS: Record<ImageCategory, ImageAsset[]> = {
  technology: [
    buildImageAsset('technology', 'img-tech-laptop', '笔记本电脑', 'tech-laptop', '笔记本电脑'),
    buildImageAsset('technology', 'img-tech-coding', '编程代码', 'tech-coding', '编程代码'),
    buildImageAsset('technology', 'img-tech-server', '服务器', 'tech-server', '服务器机房'),
    buildImageAsset('technology', 'img-tech-circuit', '电路板', 'tech-circuit', '电路板特写'),
    buildImageAsset('technology', 'img-tech-robot', '机器人', 'tech-robot', '机器人'),
    buildImageAsset('technology', 'img-tech-ai', '人工智能', 'tech-ai', '人工智能'),
  ],
  business: [
    buildImageAsset('business', 'img-biz-office', '办公室', 'biz-office', '办公室环境'),
    buildImageAsset('business', 'img-biz-meeting', '会议', 'biz-meeting', '商务会议'),
    buildImageAsset('business', 'img-biz-handshake', '握手', 'biz-handshake', '商务握手'),
    buildImageAsset('business', 'img-biz-chart', '图表', 'biz-chart', '数据图表'),
    buildImageAsset('business', 'img-biz-teamwork', '团队协作', 'biz-teamwork', '团队协作'),
    buildImageAsset('business', 'img-biz-startup', '创业', 'biz-startup', '创业公司'),
  ],
  nature: [
    buildImageAsset('nature', 'img-nat-mountain', '山脉', 'nat-mountain', '山脉风景'),
    buildImageAsset('nature', 'img-nat-ocean', '海洋', 'nat-ocean', '海洋风景'),
    buildImageAsset('nature', 'img-nat-forest', '森林', 'nat-forest', '森林风景'),
    buildImageAsset('nature', 'img-nat-sunset', '日落', 'nat-sunset', '日落风景'),
    buildImageAsset('nature', 'img-nat-flower', '花卉', 'nat-flower', '花卉特写'),
    buildImageAsset('nature', 'img-nat-waterfall', '瀑布', 'nat-waterfall', '瀑布风景'),
  ],
  food: [
    buildImageAsset('food', 'img-food-coffee', '咖啡', 'food-coffee', '咖啡'),
    buildImageAsset('food', 'img-food-sushi', '寿司', 'food-sushi', '寿司'),
    buildImageAsset('food', 'img-food-pizza', '披萨', 'food-pizza', '披萨'),
    buildImageAsset('food', 'img-food-salad', '沙拉', 'food-salad', '沙拉'),
    buildImageAsset('food', 'img-food-cake', '蛋糕', 'food-cake', '蛋糕'),
    buildImageAsset('food', 'img-food-fruit', '水果', 'food-fruit', '水果拼盘'),
  ],
  city: [
    buildImageAsset('city', 'img-city-skyline', '天际线', 'city-skyline', '城市天际线'),
    buildImageAsset('city', 'img-city-street', '街道', 'city-street', '城市街道'),
    buildImageAsset('city', 'img-city-bridge', '桥梁', 'city-bridge', '城市桥梁'),
    buildImageAsset('city', 'img-city-building', '建筑', 'city-building', '现代建筑'),
    buildImageAsset('city', 'img-city-night', '夜景', 'city-night', '城市夜景'),
    buildImageAsset('city', 'img-city-traffic', '交通', 'city-traffic', '城市交通'),
  ],
  people: [
    buildImageAsset('people', 'img-ppl-portrait', '肖像', 'ppl-portrait', '人物肖像'),
    buildImageAsset('people', 'img-ppl-team', '团队', 'ppl-team', '团队合影'),
    buildImageAsset('people', 'img-ppl-crowd', '人群', 'ppl-crowd', '人群'),
    buildImageAsset('people', 'img-ppl-smile', '微笑', 'ppl-smile', '微笑的人'),
    buildImageAsset('people', 'img-ppl-work', '工作', 'ppl-work', '工作中的人'),
    buildImageAsset('people', 'img-ppl-study', '学习', 'ppl-study', '学习中的人'),
  ],
  abstract: [
    buildImageAsset('abstract', 'img-abs-pattern', '图案', 'abs-pattern', '抽象图案'),
    buildImageAsset('abstract', 'img-abs-gradient', '渐变', 'abs-gradient', '渐变色彩'),
    buildImageAsset('abstract', 'img-abs-texture', '纹理', 'abs-texture', '抽象纹理'),
    buildImageAsset('abstract', 'img-abs-geometric', '几何', 'abs-geometric', '几何图形'),
    buildImageAsset('abstract', 'img-abs-colorful', '多彩', 'abs-colorful', '多彩抽象'),
    buildImageAsset('abstract', 'img-abs-minimal', '极简', 'abs-minimal', '极简设计'),
  ],
};
