import React from 'react';
import { Trash2, Eye } from 'lucide-react';

// ProductCard Component
const ProductCard = ({ product, isWishlist }) => (
  <div className="relative bg-white rounded-lg p-3 w-60 shadow hover:shadow-lg">
    {product.discount && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        {product.discount}
      </span>
    )}
    {product.tag && (
      <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
        {product.tag}
      </span>
    )}
    {isWishlist ? (
      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <Trash2 size={16} />
      </button>
    ) : (
      <button className="absolute top-2 right-2 text-gray-500 hover:text-teal-500">
        <Eye size={16} />
      </button>
    )}
    <img src={product.image} alt={product.title} className="w-full h-36 object-contain mb-2" />
    <h3 className="text-sm font-semibold mb-1">{product.title}</h3>

    <button className="mt-2 w-full bg-teal-500 text-white text-sm py-1 rounded hover:bg-teal-600">
      Add To Cart
    </button>

    <div className="text-sm font-bold text-teal-600 mt-2">${product.price}</div>
    {product.oldPrice && (
      <div className="text-xs line-through text-gray-500">${product.oldPrice}</div>
    )}
    {product.rating && (
      <div className="flex text-yellow-400 text-sm mt-1">
        {'★★★★★'.slice(0, product.rating)}
        <span className="ml-1 text-gray-500 text-xs">(65)</span>
      </div>
    )}
  </div>
);

// Data
const products = [
  {
    id: 1,
    price: 960,
    oldPrice: 1160,
    image: 'https://i.pinimg.com/736x/8b/73/1c/8b731ce4b06f27eca1b3553af64e44fe.jpg',
    discount: '-35%'
  },
  {
    id: 2,
    price: 1960,
    image: 'https://i.pinimg.com/736x/05/56/49/0556496b704e1416d2ebd1578040deb3.jpg'
  },
  {
    id: 3,
    price: 550,
    image: 'https://i.pinimg.com/736x/b7/74/89/b77489515b0dd131412614e026c91ef2.jpg'
  },
  {
    id: 4,
    price: 750,
    image: 'https://i.pinimg.com/736x/86/2f/09/862f098c5a6b19a6af0296cf7fc191a5.jpg'
  }
];

const recommendations = [
  {
    id: 5,
    price: 960,
    oldPrice: 1160,
    discount: '-35%',
    rating: 5,
    image: 'https://i.pinimg.com/736x/c8/9b/a0/c89ba048b876a43d1d46d1de1e7a94e0.jpg'
  },
  {
    id: 6,
    price: 1160,
    rating: 5,
    image: 'https://i.pinimg.com/736x/29/ff/c1/29ffc13f19c249799aa64643c2412a90.jpg'
  },
  {
    id: 7,
    price: 560,
    rating: 5,
    image: 'https://i.pinimg.com/736x/d8/0e/a5/d80ea585084f5dec0878238b5cd961b5.jpg',
    tag: 'NEW'
  },
  {
    id: 8,
    price: 200,
    rating: 5,
    image: 'https://i.pinimg.com/736x/57/19/ec/5719eca957ca77660b81bc34a47a4476.jpg'
  }
];

// Wishlist Page
const WishlistPage = () => {
  return (
    <div className="p-6">
      {/* Wishlist Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Wishlist ({products.length})</h2>
        <button className="border px-4 py-1 rounded hover:bg-gray-100">Move All To Bag</button>
      </div>

      {/* Wishlist Items */}
      <div className="flex flex-wrap gap-4 mb-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isWishlist={true} />
        ))}
      </div>

      {/* Recommendation Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-4 bg-teal-500 inline-block"></span> Just For You
        </h2>
        <button className="border px-4 py-1 rounded hover:bg-gray-100">See All</button>
      </div>

      {/* Recommendations */}
      <div className="flex flex-wrap gap-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} isWishlist={false} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
