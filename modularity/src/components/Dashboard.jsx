export default function Dashboard() {
  console.log('✅ Dashboard 組件載入完成！');
  return (
    <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
      <h3 className="text-2xl font-bold mb-4">儀表板</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/20 p-4 rounded text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-semibold">分析</div>
        </div>
        <div className="bg-white/20 p-4 rounded text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold">用戶</div>
        </div>
        <div className="bg-white/20 p-4 rounded text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="font-semibold">營收</div>
        </div>
      </div>
      <p className="text-sm opacity-90">
        ✅ 通過 React.lazy 載入 (載入時間: {new Date().toLocaleTimeString()})
      </p>
    </div>
  );
}