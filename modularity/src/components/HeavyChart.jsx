export default function HeavyChart({ title, data }) {
  console.log('✅ HeavyChart 組件載入完成！');
  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
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
        ✅ 獨立 chunk 載入完成
      </p>
    </div>
  );
}