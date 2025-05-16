import React, { useState } from 'react';
import { Star, Heart, Truck, RotateCw } from 'lucide-react';
import ProductFullDetails from 'components/Productfulldetails';

interface RelatedItem {
  title: string;
  price: string;
  oldPrice: string;
  discount: string;
  image: string;
  reviews: number;
}

const ProductDetails: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    setQuantity((prev) => (type === 'inc' ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const relatedItems: RelatedItem[] = [
    {
      title: 'HAVIT HV-G92 Gamepad',
      price: '$120',
      oldPrice: '$160',
      discount: '40%',
      image: 'https://i.pinimg.com/736x/3e/0d/18/3e0d185ef1d5533976463e32a2e07c9d.jpg',
      reviews: 88
    },
    {
      title: 'AK-900 Wired Keyboard',
      price: '$960',
      oldPrice: '$1110',
      discount: '35%',
      image: '/images/related2.jpg',
      reviews: 75
    },
    {
      title: 'IPS LCD Gaming Monitor',
      price: '$370',
      oldPrice: '$480',
      discount: '30%',
      image: '/images/related3.jpg',
      reviews: 99
    },
    {
      title: 'RGB liquid CPU Cooler',
      price: '$160',
      oldPrice: '$170',
      discount: '',
      image: '/images/related4.jpg',
      reviews: 65
    }
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4 text-gray-600">
        Account / Gaming / <span className="text-black font-medium">Havic HV G-92 Gamepad</span>
      </nav>

      <div className='flex justify-between flex-row'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`/images/thumb${i}.jpg`}
                alt="thumb"
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
          <div>
            <img src="/images/main.jpg" alt="main" className="w-full h-auto rounded-lg border" />
          </div>
        </div>
        </div>

        <ProductFullDetails/>
      </div>

      {/* Related Items */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedItems.map((item, i) => (
            <div key={i} className="border p-3 rounded hover:shadow">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover mb-2" />
              <div className="font-medium mb-1">{item.title}</div>
              <div className="flex gap-2 items-center">
                <span className="text-green-600 font-semibold">{item.price}</span>
                <span className="line-through text-gray-400">{item.oldPrice}</span>
              </div>
              <div className="text-sm text-yellow-500">{'★'.repeat(5)} <span className="text-gray-600">({item.reviews})</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="mt-20 bg-black text-white py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Exclusive</h3>
            <p className="mb-2">Get 10% off your first order</p>
            <input type="email" placeholder="Enter your email" className="p-2 rounded w-full text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <p>123 Sample Street, Dharkenley District, Mogadishu, Somalia</p>
            <p>alisommarket@gmail.com</p>
            <p>+252-610-000000</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Account</h3> */}
            {/* <ul>
              <li>My Account</li> */}
              {/* <li>Login / Register</li>
              <li>Cart</li>
              <li>Wishlist</li>
              <li>Shop</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Link</h3>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm mt-6">© Copyright Alisom online market 2025. All rights reserved.</div>
      </footer> */}
    </div>
  );
};

export default ProductDetails;
