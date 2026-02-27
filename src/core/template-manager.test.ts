import { describe, it, expect } from 'vitest';
import {
  getPresetTemplates,
  getTemplate,
  getTemplatesByCategory,
  TEMPLATE_CATEGORIES,
} from './template-manager';

describe('TemplateManager', () => {
  describe('getPresetTemplates', () => {
    it('returns at least 8 preset templates', () => {
      const templates = getPresetTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(8);
    });

    it('includes tech-share, product-promo, and daily-essay templates', () => {
      const templates = getPresetTemplates();
      const ids = templates.map((t) => t.id);
      expect(ids).toContain('tech-share');
      expect(ids).toContain('product-promo');
      expect(ids).toContain('daily-essay');
    });

    it('each template has non-empty id, name, category, description, and content', () => {
      const templates = getPresetTemplates();
      for (const template of templates) {
        expect(template.id).toBeTruthy();
        expect(template.name).toBeTruthy();
        expect(template.category).toBeTruthy();
        expect(template.description).toBeTruthy();
        expect(template.content).toBeTruthy();
        expect(template.content.length).toBeGreaterThan(0);
      }
    });

    it('each template content contains Markdown heading syntax', () => {
      const templates = getPresetTemplates();
      for (const template of templates) {
        expect(template.content).toMatch(/^#/m);
      }
    });
  });

  describe('getTemplate', () => {
    it('returns the correct template by id', () => {
      const template = getTemplate('tech-share');
      expect(template).toBeDefined();
      expect(template!.name).toContain('技术分享');
    });

    it('returns undefined for unknown id', () => {
      expect(getTemplate('nonexistent')).toBeUndefined();
    });

    it('returns undefined for empty string id', () => {
      expect(getTemplate('')).toBeUndefined();
    });

    it('tech-share template contains expected sections', () => {
      const template = getTemplate('tech-share')!;
      expect(template.content).toContain('背景');
      expect(template.content).toContain('核心方案');
      expect(template.content).toContain('总结');
    });

    it('product-promo template contains expected sections', () => {
      const template = getTemplate('product-promo')!;
      expect(template.content).toContain('亮点');
      expect(template.content).toContain('用户');
      expect(template.content).toContain('体验');
    });

    it('daily-essay template contains expected sections', () => {
      const template = getTemplate('daily-essay')!;
      expect(template.content).toContain('故事');
      expect(template.content).toContain('感悟');
    });
  });

  describe('getTemplatesByCategory', () => {
    it('returns all templates when category is "all"', () => {
      const all = getTemplatesByCategory('all');
      expect(all.length).toBe(getPresetTemplates().length);
    });

    it('filters templates by category', () => {
      const work = getTemplatesByCategory('work');
      expect(work.length).toBeGreaterThan(0);
      for (const t of work) {
        expect(t.category).toBe('work');
      }
    });

    it('returns templates for each defined category', () => {
      for (const cat of TEMPLATE_CATEGORIES) {
        const templates = getTemplatesByCategory(cat.key);
        expect(templates.length).toBeGreaterThanOrEqual(cat.key === 'all' ? 1 : 0);
      }
    });
  });

  describe('template uniqueness', () => {
    it('all template ids are unique', () => {
      const templates = getPresetTemplates();
      const ids = templates.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
