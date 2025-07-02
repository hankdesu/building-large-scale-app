export default function UserProfile() {
  console.log('✅ UserProfile 組件載入完成！');
  return (
    <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white">
      <h3 className="text-2xl font-bold mb-4">用戶資料</h3>
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mr-4">
          👤
        </div>
        <div>
          <div className="text-xl font-semibold">張小明</div>
          <div className="opacity-90">高級會員</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>註冊日期:</span>
          <span>2023-01-15</span>
        </div>
        <div className="flex justify-between">
          <span>總訂單:</span>
          <span>42</span>
        </div>
        <div className="flex justify-between">
          <span>總消費:</span>
          <span>$2,580</span>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-90">
        ✅ 通過 React.lazy 載入 (載入時間: {new Date().toLocaleTimeString()})
      </p>
    </div>
  );
}