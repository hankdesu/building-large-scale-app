import { useState } from 'react';
import './CodeSplitting.css';

// 模擬不同的模組載入
const loadModule = (moduleName, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: moduleName, loadedAt: new Date().toISOString() });
    }, delay);
  });
};

// Loading 組件
const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="loading">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);

// 1. Entry Point Splitting 範例
const EntryPointSplittingDemo = () => {
  const [loadedPages, setLoadedPages] = useState({});
  const [currentPage, setCurrentPage] = useState('home');
  const [loadingPage, setLoadingPage] = useState(null);

  const pages = {
    home: 'Home Page Bundle',
    dashboard: 'Dashboard Bundle',
    profile: 'Profile Bundle',
    settings: 'Settings Bundle',
  };

  const loadPage = async (pageName) => {
    if (loadedPages[pageName]) {
      setCurrentPage(pageName);
      return;
    }

    setLoadingPage(pageName);
    try {
      const module = await loadModule(`${pageName}-bundle`, 800);
      setLoadedPages((prev) => ({ ...prev, [pageName]: module }));
      setCurrentPage(pageName);
    } catch (error) {
      console.error('Failed to load page:', error);
    } finally {
      setLoadingPage(null);
    }
  };

  return (
    <div className="demo-section">
      <div className="demo-title">1. Entry Point Splitting</div>
      <p>根據不同的頁面入口點分割代碼，只載入當前頁面所需的代碼。</p>

      <div className="feature-card">
        <div className="feature-title">頁面導航</div>
        <div style={{ marginBottom: '15px' }}>
          {Object.keys(pages).map((page) => (
            <button
              key={page}
              className={`btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => loadPage(page)}
              disabled={loadingPage === page}
              style={{
                background: currentPage === page ? '#28a745' : '#007bff',
                marginRight: '10px',
              }}
            >
              {loadingPage === page ? 'Loading...' : pages[page]}
            </button>
          ))}
        </div>

        <div className="code-example">
          <strong>當前頁面:</strong> {pages[currentPage]}
          <br />
          <strong>已載入頁面:</strong> {Object.keys(loadedPages).length} /{' '}
          {Object.keys(pages).length}
          <br />
          <strong>載入狀態:</strong>{' '}
          {loadingPage ? `正在載入 ${loadingPage}...` : '完成'}
        </div>

        <div className="stats">
          {Object.entries(loadedPages).map(([page, data]) => (
            <div key={page} className="stat-card">
              <div className="stat-number">{page}</div>
              <div className="stat-label">
                載入於 {new Date(data.loadedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Vendor Splitting 範例
const VendorSplittingDemo = () => {
  const [loadedVendors, setLoadedVendors] = useState({});
  const [loadingVendor, setLoadingVendor] = useState(null);

  const vendors = {
    react: {
      name: 'React Library',
      size: '42KB',
      description: 'React核心函式庫',
    },
    lodash: {
      name: 'Lodash Utils',
      size: '67KB',
      description: '實用工具函式庫',
    },
    moment: { name: 'Moment.js', size: '67KB', description: '日期處理函式庫' },
    chartjs: { name: 'Chart.js', size: '234KB', description: '圖表繪製函式庫' },
    axios: { name: 'Axios HTTP', size: '15KB', description: 'HTTP請求函式庫' },
  };

  const loadVendor = async (vendorKey) => {
    if (loadedVendors[vendorKey]) return;

    setLoadingVendor(vendorKey);
    try {
      const module = await loadModule(`vendor-${vendorKey}`, 600);
      setLoadedVendors((prev) => ({
        ...prev,
        [vendorKey]: {
          ...vendors[vendorKey],
          loadedAt: module.loadedAt,
          cached: Math.random() > 0.5, // 模擬快取狀態
        },
      }));
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoadingVendor(null);
    }
  };

  const totalSize = Object.values(loadedVendors).reduce(
    (sum, vendor) => sum + parseInt(vendor.size),
    0
  );

  return (
    <div className="demo-section">
      <div className="demo-title">2. Vendor Splitting</div>
      <p>將第三方函式庫分離到獨立的bundle中，提高快取效率。</p>

      <div className="feature-card">
        <div className="feature-title">第三方函式庫載入</div>
        <div style={{ marginBottom: '15px' }}>
          {Object.entries(vendors).map(([key, vendor]) => (
            <button
              key={key}
              className="btn"
              onClick={() => loadVendor(key)}
              disabled={loadingVendor === key || loadedVendors[key]}
              style={{
                background: loadedVendors[key] ? '#28a745' : '#007bff',
                marginRight: '10px',
                marginBottom: '5px',
              }}
            >
              {loadingVendor === key
                ? 'Loading...'
                : loadedVendors[key]
                ? '✓ Loaded'
                : `Load ${vendor.name} (${vendor.size})`}
            </button>
          ))}
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">
              {Object.keys(loadedVendors).length}
            </div>
            <div className="stat-label">已載入函式庫</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalSize}KB</div>
            <div className="stat-label">總大小</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Object.values(loadedVendors).filter((v) => v.cached).length}
            </div>
            <div className="stat-label">已快取</div>
          </div>
        </div>

        {Object.keys(loadedVendors).length > 0 && (
          <div className="code-example">
            <strong>已載入的函式庫:</strong>
            <br />
            {Object.entries(loadedVendors).map(([key, vendor]) => (
              <div key={key}>
                • {vendor.name} ({vendor.size}) -{' '}
                {vendor.cached ? '已快取' : '新載入'} -{' '}
                {new Date(vendor.loadedAt).toLocaleTimeString()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Dynamic Splitting 範例
const DynamicSplittingDemo = () => {
  const [loadedFeatures, setLoadedFeatures] = useState({});
  const [activeFeatures, setActiveFeatures] = useState(new Set());
  const [loadingFeature, setLoadingFeature] = useState(null);

  const features = {
    'advanced-editor': { name: '進階編輯器', trigger: '編輯文件時' },
    'data-visualization': { name: '資料視覺化', trigger: '查看統計時' },
    'export-tools': { name: '匯出工具', trigger: '下載資料時' },
    collaboration: { name: '協作功能', trigger: '邀請團隊時' },
    'ai-assistant': { name: 'AI助手', trigger: '請求協助時' },
  };

  const loadFeatureOnDemand = async (featureKey) => {
    if (loadedFeatures[featureKey]) {
      setActiveFeatures((prev) => new Set([...prev, featureKey]));
      return;
    }

    setLoadingFeature(featureKey);
    try {
      const module = await loadModule(`feature-${featureKey}`, 1200);
      setLoadedFeatures((prev) => ({
        ...prev,
        [featureKey]: {
          ...features[featureKey],
          loadedAt: module.loadedAt,
        },
      }));
      setActiveFeatures((prev) => new Set([...prev, featureKey]));
    } catch (error) {
      console.error('Failed to load feature:', error);
    } finally {
      setLoadingFeature(null);
    }
  };

  const simulateUserAction = (featureKey) => {
    loadFeatureOnDemand(featureKey);
  };

  return (
    <div className="demo-section">
      <div className="demo-title">3. Dynamic Splitting</div>
      <p>根據用戶操作動態載入功能模組，只在需要時載入相關代碼。</p>

      <div className="feature-card">
        <div className="feature-title">模擬用戶操作</div>
        <p>點擊下方按鈕模擬用戶操作，觸發對應功能的動態載入：</p>

        <div style={{ marginBottom: '15px' }}>
          {Object.entries(features).map(([key, feature]) => (
            <button
              key={key}
              className="btn"
              onClick={() => simulateUserAction(key)}
              disabled={loadingFeature === key}
              style={{
                background: activeFeatures.has(key) ? '#28a745' : '#007bff',
                marginRight: '10px',
                marginBottom: '5px',
              }}
            >
              {loadingFeature === key
                ? 'Loading...'
                : activeFeatures.has(key)
                ? `✓ ${feature.name}`
                : feature.name}
            </button>
          ))}
        </div>

        <div className="code-example">
          <strong>載入觸發條件:</strong>
          <br />
          {Object.entries(features).map(([key, feature]) => (
            <div key={key}>
              • {feature.name}: {feature.trigger}
              {activeFeatures.has(key) &&
                loadedFeatures[key] &&
                ` (已載入於 ${new Date(
                  loadedFeatures[key].loadedAt
                ).toLocaleTimeString()})`}
            </div>
          ))}
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{activeFeatures.size}</div>
            <div className="stat-label">啟用功能</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Object.keys(loadedFeatures).length}
            </div>
            <div className="stat-label">已載入模組</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {(
                (Object.keys(loadedFeatures).length /
                  Object.keys(features).length) *
                100
              ).toFixed(0)}
              %
            </div>
            <div className="stat-label">載入進度</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Component-level Splitting 範例
const ComponentLevelSplittingDemo = () => {
  const [visibleComponents, setVisibleComponents] = useState(
    new Set(['header'])
  );
  const [loadedComponents, setLoadedComponents] = useState({ header: true });
  const [loadingComponent, setLoadingComponent] = useState(null);

  const components = {
    header: { name: '頁首組件', essential: true },
    sidebar: { name: '側邊欄組件', essential: false },
    'data-table': { name: '資料表格組件', essential: false },
    'chart-widget': { name: '圖表組件', essential: false },
    'comment-section': { name: '評論區組件', essential: false },
    footer: { name: '頁尾組件', essential: false },
  };

  const loadComponent = async (componentKey) => {
    if (loadedComponents[componentKey]) {
      setVisibleComponents((prev) => new Set([...prev, componentKey]));
      return;
    }

    setLoadingComponent(componentKey);
    try {
      await loadModule(`component-${componentKey}`, 800);
      setLoadedComponents((prev) => ({ ...prev, [componentKey]: true }));
      setVisibleComponents((prev) => new Set([...prev, componentKey]));
    } catch (error) {
      console.error('Failed to load component:', error);
    } finally {
      setLoadingComponent(null);
    }
  };

  const toggleComponent = (componentKey) => {
    if (visibleComponents.has(componentKey)) {
      setVisibleComponents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(componentKey);
        return newSet;
      });
    } else {
      loadComponent(componentKey);
    }
  };

  return (
    <div className="demo-section">
      <div className="demo-title">4. Component-level Splitting</div>
      <p>將大型組件分割，只在需要渲染時才載入對應的組件代碼。</p>

      <div className="feature-card">
        <div className="feature-title">組件載入控制</div>
        <div style={{ marginBottom: '15px' }}>
          {Object.entries(components).map(([key, component]) => (
            <button
              key={key}
              className="btn"
              onClick={() => toggleComponent(key)}
              disabled={loadingComponent === key || component.essential}
              style={{
                background: visibleComponents.has(key)
                  ? '#28a745'
                  : component.essential
                  ? '#6c757d'
                  : '#007bff',
                marginRight: '10px',
                marginBottom: '5px',
              }}
            >
              {loadingComponent === key
                ? 'Loading...'
                : visibleComponents.has(key)
                ? `✓ ${component.name}`
                : `Load ${component.name}`}
              {component.essential && ' (必需)'}
            </button>
          ))}
        </div>

        <div className="code-example">
          <strong>頁面組件狀態:</strong>
          <br />
          {Object.entries(components).map(([key, component]) => (
            <div
              key={key}
              style={{
                color: visibleComponents.has(key) ? '#28a745' : '#6c757d',
                fontWeight: component.essential ? 'bold' : 'normal',
              }}
            >
              • {component.name}:{' '}
              {visibleComponents.has(key)
                ? '已顯示'
                : loadedComponents[key]
                ? '已載入但隱藏'
                : '未載入'}
            </div>
          ))}
        </div>

        <div
          style={{
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '15px',
            minHeight: '200px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '15px',
              fontWeight: 'bold',
            }}
          >
            模擬頁面預覽
          </div>
          {visibleComponents.has('header') && (
            <div
              style={{
                background: '#007bff',
                color: 'white',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '4px',
              }}
            >
              📄 頁首組件 - 網站標題和導航
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            {visibleComponents.has('sidebar') && (
              <div
                style={{
                  background: '#6f42c1',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  flex: '0 0 150px',
                }}
              >
                📋 側邊欄
                <br />
                導航選單
              </div>
            )}
            <div style={{ flex: 1 }}>
              {visibleComponents.has('data-table') && (
                <div
                  style={{
                    background: '#20c997',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                  }}
                >
                  📊 資料表格組件 - 顯示數據
                </div>
              )}
              {visibleComponents.has('chart-widget') && (
                <div
                  style={{
                    background: '#fd7e14',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                  }}
                >
                  📈 圖表組件 - 數據視覺化
                </div>
              )}
              {visibleComponents.has('comment-section') && (
                <div
                  style={{
                    background: '#e83e8c',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                  }}
                >
                  💬 評論區組件 - 用戶互動
                </div>
              )}
            </div>
          </div>
          {visibleComponents.has('footer') && (
            <div
              style={{
                background: '#6c757d',
                color: 'white',
                padding: '10px',
                marginTop: '10px',
                borderRadius: '4px',
              }}
            >
              🔗 頁尾組件 - 版權和連結
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Route-based Splitting 範例
const RouteBasedSplittingDemo = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [loadedRoutes, setLoadedRoutes] = useState({ '/': true });
  const [loadingRoute, setLoadingRoute] = useState(null);
  const [routeHistory, setRouteHistory] = useState(['/']);

  const routes = {
    '/': { name: '首頁', component: 'HomeComponent', size: '25KB' },
    '/products': {
      name: '產品列表',
      component: 'ProductListComponent',
      size: '45KB',
    },
    '/product/:id': {
      name: '產品詳情',
      component: 'ProductDetailComponent',
      size: '35KB',
    },
    '/cart': { name: '購物車', component: 'CartComponent', size: '30KB' },
    '/checkout': { name: '結帳', component: 'CheckoutComponent', size: '50KB' },
    '/profile': {
      name: '個人檔案',
      component: 'ProfileComponent',
      size: '40KB',
    },
    '/admin': {
      name: '管理後台',
      component: 'AdminDashboardComponent',
      size: '75KB',
    },
  };

  const navigateToRoute = async (route) => {
    if (route === currentRoute) return;

    if (!loadedRoutes[route]) {
      setLoadingRoute(route);
      try {
        await loadModule(
          `route-${route.replace('/', '').replace(':', '')}`,
          1000
        );
        setLoadedRoutes((prev) => ({ ...prev, [route]: true }));
      } catch (error) {
        console.error('Failed to load route:', error);
        return;
      } finally {
        setLoadingRoute(null);
      }
    }

    setCurrentRoute(route);
    setRouteHistory((prev) => [...prev.slice(-4), route]);
  };

  const getRouteContent = (route) => {
    const routeInfo = routes[route];
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>{routeInfo.name}</h2>
        <p style={{ margin: '5px 0', opacity: '0.9' }}>
          組件: {routeInfo.component}
        </p>
        <p style={{ margin: '5px 0', opacity: '0.9' }}>
          大小: {routeInfo.size}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: '0.8' }}>
          路由: {route}
        </p>
      </div>
    );
  };

  return (
    <div className="demo-section">
      <div className="demo-title">5. Route-based Splitting</div>
      <p>根據路由分割代碼，每個頁面的代碼只在訪問該頁面時載入。</p>

      <div className="feature-card">
        <div className="feature-title">路由導航</div>
        <div style={{ marginBottom: '20px' }}>
          {Object.entries(routes).map(([route, info]) => (
            <button
              key={route}
              className="btn"
              onClick={() => navigateToRoute(route)}
              disabled={loadingRoute === route}
              style={{
                background:
                  currentRoute === route
                    ? '#28a745'
                    : loadedRoutes[route]
                    ? '#17a2b8'
                    : '#007bff',
                marginRight: '10px',
                marginBottom: '5px',
                fontSize: '14px',
              }}
            >
              {loadingRoute === route ? 'Loading...' : info.name}
              {loadedRoutes[route] && route !== currentRoute && ' ✓'}
            </button>
          ))}
        </div>

        <div
          style={{
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              background: '#f8f9fa',
              padding: '10px',
              borderBottom: '1px solid #dee2e6',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          >
            🌐 瀏覽器位址列:{' '}
            <strong>
              {window.location.origin}
              {currentRoute}
            </strong>
          </div>
          <div style={{ padding: '20px' }}>
            {loadingRoute ? (
              <LoadingSpinner text={`載入 ${routes[loadingRoute].name}...`} />
            ) : (
              getRouteContent(currentRoute)
            )}
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">
              {Object.keys(loadedRoutes).length}
            </div>
            <div className="stat-label">已載入路由</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Object.entries(routes)
                .filter(([route]) => loadedRoutes[route])
                .reduce((sum, [, info]) => sum + parseInt(info.size), 0)}
              KB
            </div>
            <div className="stat-label">已載入大小</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{routeHistory.length}</div>
            <div className="stat-label">瀏覽歷史</div>
          </div>
        </div>

        <div className="code-example">
          <strong>路由載入狀態:</strong>
          <br />
          {Object.entries(routes).map(([route, info]) => (
            <div
              key={route}
              style={{
                color: loadedRoutes[route] ? '#28a745' : '#6c757d',
                fontWeight: currentRoute === route ? 'bold' : 'normal',
              }}
            >
              • {route} ({info.name}) - {info.size} -{' '}
              {currentRoute === route
                ? '當前頁面'
                : loadedRoutes[route]
                ? '已載入'
                : '未載入'}
            </div>
          ))}
          <br />
          <strong>最近瀏覽:</strong> {routeHistory.slice(-5).join(' → ')}
        </div>
      </div>
    </div>
  );
};

// 主要的應用程式組件
const CodeSplittingApp = () => {
  const [activeDemo, setActiveDemo] = useState('all');

  const demos = {
    all: '全部範例',
    entry: 'Entry Point Splitting',
    vendor: 'Vendor Splitting',
    dynamic: 'Dynamic Splitting',
    component: 'Component-level Splitting',
    route: 'Route-based Splitting',
  };

  const renderDemo = () => {
    switch (activeDemo) {
      case 'entry':
        return <EntryPointSplittingDemo />;
      case 'vendor':
        return <VendorSplittingDemo />;
      case 'dynamic':
        return <DynamicSplittingDemo />;
      case 'component':
        return <ComponentLevelSplittingDemo />;
      case 'route':
        return <RouteBasedSplittingDemo />;
      default:
        return (
          <>
            <EntryPointSplittingDemo />
            <VendorSplittingDemo />
            <DynamicSplittingDemo />
            <ComponentLevelSplittingDemo />
            <RouteBasedSplittingDemo />
          </>
        );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Code-Splitting 技術範例</h1>
        <p>展示五種不同的代碼分割技術及其應用場景</p>
      </div>

      <div className="nav">
        {Object.entries(demos).map(([key, name]) => (
          <button
            key={key}
            className={`nav-button ${activeDemo === key ? 'active' : ''}`}
            onClick={() => setActiveDemo(key)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="content">
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            background: '#e3f2fd',
            borderRadius: '8px',
            borderLeft: '4px solid #2196f3',
          }}
        >
          <strong>💡 關於 Code-Splitting:</strong>
          <br />
          Code-splitting
          是一種將應用程式代碼分割成更小塊的技術，讓使用者只下載當前需要的代碼，從而提高應用程式的載入速度和效能。
          本範例展示了五種常見的代碼分割策略，每種都有其特定的使用場景和優勢。
        </div>

        {renderDemo()}

        {activeDemo === 'all' && (
          <div className="demo-section" style={{ marginTop: '40px' }}>
            <div className="demo-title">總結與最佳實踐</div>
            <div className="feature-card">
              <div className="feature-title">
                選擇合適的 Code-Splitting 策略
              </div>
              <div className="code-example">
                <strong>Entry Point Splitting:</strong>{' '}
                適用於多頁應用程式，每個頁面有獨立的入口點
                <br />
                <strong>Vendor Splitting:</strong>{' '}
                適用於使用大量第三方函式庫的專案，提高快取效率
                <br />
                <strong>Dynamic Splitting:</strong>{' '}
                適用於功能豐富的應用程式，根據用戶行為載入功能
                <br />
                <strong>Component-level Splitting:</strong>{' '}
                適用於有大型組件的應用程式，提高初始載入速度
                <br />
                <strong>Route-based Splitting:</strong>{' '}
                適用於單頁應用程式，根據路由分割代碼
              </div>

              <div style={{ marginTop: '15px' }}>
                <strong>注意事項:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>避免過度分割，太多小塊可能影響性能</li>
                  <li>考慮網路延遲，為載入狀態提供良好的用戶體驗</li>
                  <li>合理使用預載入和快取策略</li>
                  <li>監控實際效果，根據使用數據調整分割策略</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSplittingApp;
