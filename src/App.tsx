import { Layout } from './components/Layout';
import { useAppStore } from './store/app-store';
import './App.css';
import './animations.css';

function App() {
  const storageAvailable = useAppStore((s) => s.storageAvailable);

  return (
    <>
      {!storageAvailable && (
        <div
          role="alert"
          style={{
            padding: '8px 16px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderBottom: '1px solid #ffc107',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          本地存储不可用，编辑内容无法自动保存。请检查浏览器设置或存储空间。
        </div>
      )}
      <Layout />
    </>
  );
}

export default App;
