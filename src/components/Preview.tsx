import { useAppStore } from '../store/app-store';

export function Preview() {
  const formattedHtml = useAppStore((s) => s.formattedHtml);
  const markdown = useAppStore((s) => s.markdown);

  const isEmpty = !formattedHtml && !markdown.trim();

  return (
    <div className="preview-container">
      {isEmpty ? (
        <div className="preview-empty">
          <div className="preview-empty-icon">📝</div>
          <p>预览区域</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>在左侧输入 Markdown 内容即可实时预览</p>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      )}
    </div>
  );
}
