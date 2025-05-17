import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductFullDetails from "components/Productfulldetails";
import FeaturedProductCard from "components/FeaturedProductCard";
import productData from "../../../public/assets/products.json";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  brand_id: string;
  created_at: string;
  featured: boolean;
  Specifications?: string[];
  images: string[];
}

interface RelatedItem {
  title: string;
  price: number;
  oldPrice: string;
  discount: string;
  image: string;
  reviews: number;
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const allProducts = productData as Product[];
    const foundProduct = allProducts.find((p) => p.product_id === productId);
    setProduct(foundProduct);
    if (foundProduct?.images?.length) {
      setSelectedImage(foundProduct.images[0]);
    }
  }, [productId]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  if (!product) {
    return <div className="p-4">Product not found.</div>;
  }

  const relatedItems: RelatedItem[] = (productData as Product[])
    .filter(
      (p) =>
        p.category_id === product.category_id &&
        p.product_id !== product.product_id
    )
    .slice(0, 4)
    .map((p) => ({
      title: p.name,
      price: p.price,
      oldPrice: `$${(p.price * 1.2).toFixed(2)}`,
      discount: "20%",
      image: p.images[0] || "",
      reviews: Math.floor(Math.random() * 5) + 1,
    }));

  return (
    <div className="p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home / Shop /{" "}
        <span className="text-black font-semibold">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-6">
            {/* Thumbnails */}
            <div className="flex sm:flex-col sm:space-y-4 space-x-4 sm:space-x-0 overflow-x-auto sm:overflow-visible pr-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  alt={`Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover cursor-pointer flex-shrink-0 rounded-md ${
                    selectedImage === img ? "ring-2 ring-blue-500" : ""
                  }`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="bg-gray-100 rounded-md p-4 sm:p-6 flex items-center justify-center w-full h-[300px] sm:h-[500px]">
              <img
                src={selectedImage}
                alt="Selected Product"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <ProductFullDetails
            product={product}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-12">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <span className="w-8 h-14 bg-[#17C3B2] inline-block rounded-sm"></span>
          <span className="text-[#1A2238]">Related Items</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedItems.map((item, i) => (
            <FeaturedProductCard
              key={i}
              image={item.image}
              title={item.title}
              price={item.price}
              rating={item.reviews}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
