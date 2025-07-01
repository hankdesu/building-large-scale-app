import React, { useState, memo, useMemo } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  Filter,
  Search,
  Grid,
  List,
} from 'lucide-react';
import './App.css';

// 1. REUSABILITY - 可重複使用的組件
// 通用的評分組件，可在產品卡片、評論等地方重複使用
const StarRating = ({
  rating,
  maxRating = 5,
  size = 'small',
  readonly = false,
  onRatingChange,
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoveredRating || rating);

        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} cursor-pointer transition-colors ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${readonly ? 'cursor-default' : 'hover:text-yellow-400'}`}
            onMouseEnter={() => !readonly && setHoveredRating(starValue)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            onClick={() => !readonly && onRatingChange?.(starValue)}
          />
        );
      })}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

// 通用的按鈕組件，可在整個應用中重複使用
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

// 2. SIMPLICITY AND READABILITY - 簡潔易讀的組件
// 將複雜的產品卡片分解成更小、更容易理解的組件

const ProductImage = ({ src, alt, isWishlisted, onWishlistToggle }) => (
  <div className="relative">
    <img src={src} alt={alt} className="w-full h-48 object-cover rounded-lg" />
    <button
      onClick={onWishlistToggle}
      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
    >
      <Heart
        className={`w-5 h-5 ${
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
    </button>
  </div>
);

const ProductInfo = ({ name, category, price, originalPrice, description }) => (
  <div className="p-4">
    <div className="text-sm text-gray-500 mb-1">{category}</div>
    <h3 className="font-semibold text-lg mb-2">{name}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-green-600">${price}</span>
      {originalPrice && (
        <span className="text-sm text-gray-500 line-through">
          ${originalPrice}
        </span>
      )}
    </div>
  </div>
);

const ProductActions = ({ onAddToCart, onQuickView, loading }) => (
  <div className="p-4 pt-0 flex gap-2">
    <Button
      variant="primary"
      size="small"
      onClick={onAddToCart}
      loading={loading}
      className="flex-1"
    >
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </Button>
    <Button variant="outline" size="small" onClick={onQuickView}>
      Quick View
    </Button>
  </div>
);

// 3. IMPROVED TESTABILITY - 易於測試的組件
// 每個組件都有明確的輸入和輸出，容易進行單元測試

const ProductCard = ({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onQuickView,
  onRatingChange,
  loading,
}) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
    <ProductImage
      src={product.image}
      alt={product.name}
      isWishlisted={isWishlisted}
      onWishlistToggle={() => onWishlistToggle(product.id)}
    />
    <ProductInfo
      name={product.name}
      category={product.category}
      price={product.price}
      originalPrice={product.originalPrice}
      description={product.description}
    />
    <div className="px-4 pb-2">
      <StarRating
        rating={product.rating}
        onRatingChange={(newRating) => onRatingChange(product.id, newRating)}
      />
    </div>
    <ProductActions
      onAddToCart={() => onAddToCart(product)}
      onQuickView={() => onQuickView(product)}
      loading={loading}
    />
  </div>
);

// 4. PERFORMANCE CONSIDERATIONS - 性能優化的組件
// 使用 memo 和 useMemo 來避免不必要的重新渲染

const ProductList = memo(
  ({
    products,
    wishlist,
    onWishlistToggle,
    onAddToCart,
    onQuickView,
    onRatingChange,
    loading,
  }) => {
    // 使用 useMemo 來避免每次渲染時都重新計算
    const productElements = useMemo(() => {
      return products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlist.includes(product.id)}
          onWishlistToggle={onWishlistToggle}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onRatingChange={onRatingChange}
          loading={loading}
        />
      ));
    }, [
      products,
      wishlist,
      onWishlistToggle,
      onAddToCart,
      onQuickView,
      onRatingChange,
      loading,
    ]);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productElements}
      </div>
    );
  }
);

// 搜索和篩選組件
const SearchAndFilter = memo(
  ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    viewMode,
    onViewModeChange,
  }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
);

// 主要的產品展示組件
const ProductShowcase = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 79.99,
      originalPrice: 99.99,
      description:
        'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
      rating: 4.5,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 299.99,
      description:
        'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      price: 24.99,
      originalPrice: 34.99,
      description:
        'Comfortable and sustainable organic cotton t-shirt in various colors.',
      rating: 4.2,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Coffee Maker Deluxe',
      category: 'Home & Kitchen',
      price: 149.99,
      description:
        'Programmable coffee maker with built-in grinder and thermal carafe.',
      rating: 4.6,
      image:
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    },
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (product) => {
    setLoading(true);
    // 模擬 API 調用
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Added ${product.name} to cart!`);
    setLoading(false);
  };

  const handleQuickView = (product) => {
    alert(`Quick view for ${product.name}`);
  };

  const handleRatingChange = (productId, newRating) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, rating: newRating } : product
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Showcase
        </h1>
        <p className="text-gray-600">
          Discover our collection of amazing products
        </p>
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mb-4">
        <p className="text-gray-600">
          Found {filteredProducts.length} product
          {filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <ProductList
        products={filteredProducts}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
        onQuickView={handleQuickView}
        onRatingChange={handleRatingChange}
        loading={loading}
      />
    </div>
  );
};

export default ProductShowcase;
