import React from 'react';
import { Trash2, Eye } from 'lucide-react';

const products = [
  {
    id: 1,
    price: 960,
    oldPrice: 1160,
    image: 'https://i.pinimg.com/736x/93/91/38/939138053b567bd242a6eb161f07c6cb.jpg',
    discount: '-35%'
  },
  {
    id: 2,
    price: 1960,
    image: 'https://i.pinimg.com/736x/fc/34/70/fc34707bb73cd4de29ce60844e6f2af4.jpg'
  },
  {
    id: 3,
    price: 550,
    image: 'https://i.pinimg.com/736x/8a/d1/52/8ad1527ff5272e326cb9ba5a8d250fac.jpg'
  },
  {
    id: 4,
    price: 750,
    image: 'https://i.pinimg.com/736x/07/0f/dd/070fdd2826aae03481e36254785eb386.jpg'
  }
];

const recommendations = [
  {
    id: 5,
    price: 960,
    oldPrice: 1160,
    discount: '-35%',
    rating: 5,
    image: 'https://i.pinimg.com/736x/e5/bf/c7/e5bfc72db7ad186daf6f4293316d69ea.jpg'
  },
  {
    id: 6,
    price: 1160,
    rating: 5,
    image: 'https://i.pinimg.com/736x/28/4a/73/284a736e4e25c2f21406916e4f1700d3.jpg'
  },
  {
    id: 7,
    price: 560,
    rating: 5,
    image: 'https://i.pinimg.com/736x/7e/a3/58/7ea358ac01532dc5c1d2530ef701ab14.jpg',
    tag: 'NEW'
  },
  {
    id: 8,
    price: 200,
    rating: 5,
    image: 'https://i.pinimg.com/736x/dd/a2/fb/dda2fb1e04380c2ee168ceaed61ac785.jpg'
  }
];

const ProductCard = ({ product, isWishlist }) => (
  <div className="relative bg-white  p-3 w-60 shadow hover:shadow-lg">
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
    {isWishlist && (
      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <Trash2 size={16} />
      </button>
    )}
    {!isWishlist && (
      <button className="absolute top-2 right-2 text-gray-500 hover:text-teal-500">
        <Eye size={16} />
      </button>
    )}
    <img src={product.image} alt={product.title} className="w-full h-36 object-contain mb-2" />
    <h3 className="text-sm font-semibold mb-1">{product.title}</h3>
   {/* Price & Old Price on one line */}
    <div className="flex items-baseline space-x-2 mt-1">
      <span className="text-sm font-bold text-teal-600">
        ${product.price}
      </span>
      {product.oldPrice !== undefined && (
        <span className="text-xs line-through text-gray-500">
          ${product.oldPrice}
        </span>
      )}
    </div>
    {product.rating && (
      <div className="flex text-yellow-400 text-sm mt-1">
        {'★★★★★'.slice(0, product.rating)}
        <span className="ml-1 text-gray-500 text-xs">(65)</span>
      </div>
    )}
    <button className="mt-2 w-full bg-teal-500 text-white text-sm py-1 rounded hover:bg-teal-600">
      Add To Cart
    </button>
  </div>
);

const WishlistPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Wishlist ({products.length})</h2>
        <button className="border px-4 py-1 rounded hover:bg-gray-100">Move All To Bag</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isWishlist={true} />
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-4 bg-teal-500 inline-block"></span> Just For You
        </h2>
        <button className="border px-4 py-1 rounded hover:bg-gray-100">See All</button>
      </div>

      <div className="flex flex-wrap gap-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} isWishlist={false} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
