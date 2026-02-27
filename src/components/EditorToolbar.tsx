import { useAppStore } from '../store/app-store';

interface MarkdownAction {
  icon: string;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const ACTIONS: MarkdownAction[] = [
  { icon: 'H1', label: '一级标题', prefix: '# ', suffix: '', block: true },
  { icon: 'H2', label: '二级标题', prefix: '## ', suffix: '', block: true },
  { icon: 'H3', label: '三级标题', prefix: '### ', suffix: '', block: true },
  { icon: 'B', label: '加粗', prefix: '**', suffix: '**' },
  { icon: 'I', label: '斜体', prefix: '*', suffix: '*' },
  { icon: 'S', label: '删除线', prefix: '~~', suffix: '~~' },
  { icon: '❝', label: '引用', prefix: '> ', suffix: '', block: true },
  { icon: '—', label: '分割线', prefix: '\n---\n', suffix: '', block: true },
  { icon: '🔗', label: '链接', prefix: '[', suffix: '](url)' },
  { icon: '📋', label: '代码块', prefix: '```\n', suffix: '\n```', block: true },
  { icon: '•', label: '无序列表', prefix: '- ', suffix: '', block: true },
  { icon: '1.', label: '有序列表', prefix: '1. ', suffix: '', block: true },
];

export function EditorToolbar() {
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const cursorPosition = useAppStore((s) => s.cursorPosition);

  const handleAction = (action: MarkdownAction) => {
    const before = markdown.slice(0, cursorPosition);
    const after = markdown.slice(cursorPosition);
    const needsNewline = action.block && before.length > 0 && !before.endsWith('\n');
    const prefix = (needsNewline ? '\n' : '') + action.prefix;
    const newMarkdown = before + prefix + action.suffix + after;
    setMarkdown(newMarkdown);
  };

  return (
    <div className="editor-toolbar">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          className="editor-toolbar-btn"
          onClick={() => handleAction(action)}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
