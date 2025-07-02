import React, { Suspense, useState } from 'react';
// import Dashboard from './components/Dashboard';
// import UserProfile from './components/UserProfile';

// 範例1：使用純 Dynamic Import (不使用 React.lazy)
function DynamicImportExample() {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHeavyComponent = async () => {
    setLoading(true);
    setError(null);

    try {
      // 模擬動態導入一個重型組件
      const module = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            default: ({ title, data }) => (
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.map((item, index) => (
                    <div key={index} className="bg-white/20 p-3 rounded">
                      <div className="text-lg font-semibold">{item.label}</div>
                      <div className="text-2xl">{item.value}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm opacity-90">
                  ✅ 通過 Dynamic Import 載入
                </p>
              </div>
            )
          });
        }, 1500);
      });

      setComponent(() => module.default);
    } catch (err) {
      console.log('err: ', err);
      setError('載入組件失敗');
    } finally {
      setLoading(false);
    }
  };

  const unloadComponent = () => {
    setComponent(null);
    setError(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">範例1：純 Dynamic Import</h2>
      <div className="mb-4">
        <button
          onClick={loadHeavyComponent}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
        >
          {loading ? '載入中...' : '載入重型組件'}
        </button>
        {Component && (
          <button
            onClick={unloadComponent}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            卸載組件
          </button>
        )}
      </div>

      {loading && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            正在動態載入組件...
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          錯誤：{error}
        </div>
      )}

      {Component && (
        <Component
          title="動態載入的組件"
          data={[
            { label: '用戶數', value: '1,234' },
            { label: '訂單數', value: '567' },
            { label: '收入', value: '$12,345' },
            { label: '轉換率', value: '3.2%' }
          ]}
        />
      )}
    </div>
  );
}

// 範例2：使用 React.lazy + Suspense
const LazyDashboard = React.lazy(() => {
  console.log('🔄 Dashboard 組件開始載入...'); // 只會在第一次載入時執行
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('✅ Dashboard chunk 載入完成！耗時 2 秒');
      resolve(import('./components/Dashboard'));
    }, 2000); // 模擬 2 秒載入時間
  });
});

const LazyUserProfile = React.lazy(() => {
  console.log('🔄 UserProfile 組件開始載入...'); // 只會在第一次載入時執行
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('✅ UserProfile chunk 載入完成！耗時 1.5 秒');
      resolve(import('./components/UserProfile'));
    }, 1500); // 模擬 1.5 秒載入時間
  });
});

// Suspense Loading 組件
const SuspenseLoader = ({ message }) => (
  <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <div className="text-center">
      <div className="animate-pulse flex items-center justify-center mb-3">
        <div className="rounded-full bg-gray-300 h-8 w-8"></div>
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

function ReactLazyExample() {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return (
          <Suspense fallback={<SuspenseLoader message="載入儀表板中..." />}>
            <LazyDashboard />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<SuspenseLoader message="載入用戶資料中..." />}>
            <LazyUserProfile />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<SuspenseLoader message="載入儀表板中..." />}>
            <LazyDashboard />
          </Suspense>
        );
        // return (
        //   <div className="p-6 bg-gray-100 rounded-lg text-center">
        //     <div className="text-4xl mb-3">🚀</div>
        //     <h3 className="text-xl font-semibold mb-2">選擇要載入的組件</h3>
        //     <p className="text-gray-600">點擊上方按鈕體驗 React.lazy 懶載入</p>
        //   </div>
        // );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">範例2：React.lazy + Suspense</h2>
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setActiveComponent(activeComponent === 'dashboard' ? null : 'dashboard')}
          className={`px-4 py-2 rounded transition-colors ${
            activeComponent === 'dashboard'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {activeComponent === 'dashboard' ? '隱藏' : '載入'} 儀表板
        </button>
        <button
          onClick={() => setActiveComponent(activeComponent === 'profile' ? null : 'profile')}
          className={`px-4 py-2 rounded transition-colors ${
            activeComponent === 'profile'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {activeComponent === 'profile' ? '隱藏' : '載入'} 用戶資料
        </button>
      </div>

      {renderComponent()}
    </div>
  );
}

// 主應用
export default function CodeSplittingDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Code Splitting 技術比較
      </h1>

      <DynamicImportExample />

      <hr className="my-8 border-gray-300" />

      <ReactLazyExample />

      {/* 技術差異說明 */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">技術差異說明</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-700 mb-2">🔧 Dynamic Import</h4>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• 手動控制載入狀態</li>
              <li>• 更靈活的錯誤處理</li>
              <li>• 可以載入任何模組</li>
              <li>• 需要自己管理 loading 狀態</li>
              <li>• 適合複雜的載入邏輯</li>
              <li>• <strong>每次調用都會重新載入</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-yellow-700 mb-2">⚛️ React.lazy + Suspense</h4>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• React 官方推薦方式</li>
              <li>• 自動處理載入狀態</li>
              <li>• 聲明式的 loading UI</li>
              <li>• 僅適用於 React 組件</li>
              <li>• 更簡潔的代碼</li>
              <li>• <strong>自動緩存已載入組件</strong></li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm text-yellow-700 mb-2">
            <strong>🔍 測試緩存行為：</strong>
          </p>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. 打開瀏覽器開發者工具的 Console</li>
            <li>2. 點擊載入儀表板，觀察 console 輸出</li>
            <li>3. 隱藏後再次載入，注意沒有 console 輸出</li>
            <li>4. 這證明 React.lazy 緩存了組件，不會重複載入</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm text-yellow-700">
            <strong>建議：</strong>對於 React 組件的懶載入，優先使用 React.lazy + Suspense；
            對於需要複雜載入邏輯或載入非組件資源時，使用 Dynamic Import。
          </p>
        </div>
      </div>
    </div>
  );
}