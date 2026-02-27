import { useAppStore } from '../store/app-store';

export function Preview() {
  const formattedHtml = useAppStore((s) => s.formattedHtml);
  const markdown = useAppStore((s) => s.markdown);

  const isEmpty = !formattedHtml && !markdown.trim();

  return (
    <div
      className="theme-transition focus-highlight"
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
      }}
    >
      {isEmpty ? (
        <p
          style={{
            color: '#999',
            textAlign: 'center',
            marginTop: '40px',
            fontSize: '14px',
          }}
        >
          预览区域 - 请在左侧输入 Markdown 内容
        </p>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      )}
    </div>
  );
}
