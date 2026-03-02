import { useMemo } from 'react';
import { useAppStore } from '../store/app-store';

export function WordStats() {
  const markdown = useAppStore((s) => s.markdown);
  const wordStatsOpen = useAppStore((s) => s.wordStatsOpen);
  const setWordStatsOpen = useAppStore((s) => s.setWordStatsOpen);

  const stats = useMemo(() => {
    if (!markdown) return null;
    // Strip markdown syntax for pure text analysis
    const text = markdown
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[#*_~>\-|`]/g, '')
      .trim();

    const chars = text.replace(/\s/g, '').length;
    const charsWithSpaces = text.length;
    const lines = markdown.split('\n').length;
    const paragraphs = markdown.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const readingMinutes = Math.max(1, Math.ceil(chars / 400));

    // Chinese character count
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    // English word count
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    // Heading count
    const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
    // Image count
    const images = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length + (markdown.match(/<img\s/gi) || []).length;
    // Link count
    const links = (markdown.match(/\[([^\]]+)\]\((?!.*\))/g) || []).length + (markdown.match(/<a\s/gi) || []).length;
    // Code block count
    const codeBlocks = (markdown.match(/```/g) || []).length / 2;

    // Top frequency Chinese characters (excluding common ones)
    const commonChars = new Set('的了是在不有和人这中大为上个国我以要他时来用们生到作地于出会家可下而过子后也年前两同工已还当没因很学只以所从才体与本那些现于理然还这就都好被小我你他她它们');
    const charFreq: Record<string, number> = {};
    for (const ch of text) {
      if (/[\u4e00-\u9fff]/.test(ch) && !commonChars.has(ch)) {
        charFreq[ch] = (charFreq[ch] || 0) + 1;
      }
    }
    const topChars = Object.entries(charFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { chars, charsWithSpaces, lines, paragraphs, readingMinutes, chineseChars, englishWords, headings, images, links, codeBlocks: Math.floor(codeBlocks), topChars };
  }, [markdown]);

  if (!wordStatsOpen) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setWordStatsOpen(true)} title="字数统计">
        📊 统计
      </button>
    );
  }

  return (
    <div className="dialog-overlay" onClick={() => setWordStatsOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">📊 文章统计</div>
        <div className="dialog-body">
          {!stats ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>暂无内容</p>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {([
                  ['字符数', stats.chars.toLocaleString(), '#6366f1'],
                  ['中文字', stats.chineseChars.toLocaleString(), '#ec4899'],
                  ['英文词', stats.englishWords.toLocaleString(), '#14b8a6'],
                  ['段落', stats.paragraphs.toString(), '#f59e0b'],
                  ['行数', stats.lines.toLocaleString(), '#8b5cf6'],
                  ['阅读时间', `${stats.readingMinutes}分钟`, '#06b6d4'],
                ] as const).map(([label, value, color]) => (
                  <div key={label} style={{ background: 'var(--surface-dim)', padding: '12px 10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span>📑 标题 {stats.headings}</span>
                <span>🖼️ 图片 {stats.images}</span>
                <span>🔗 链接 {stats.links}</span>
                <span>💻 代码块 {stats.codeBlocks}</span>
              </div>

              {stats.topChars.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>高频用字 Top 10</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {stats.topChars.map(([ch, count]) => (
                      <span key={ch} style={{ padding: '3px 8px', fontSize: '12px', background: 'var(--surface-dim)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {ch} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setWordStatsOpen(false)}>关闭</button>
        </div>
      </div>
    </div>
  );
}
