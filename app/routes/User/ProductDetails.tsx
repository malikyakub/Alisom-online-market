import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductFullDetails from "components/Productfulldetails";
import FeaturedProductCard from "components/FeaturedProductCard";
import useProducts from "hooks/useProducts";
import Heading from "components/Heading";
import ProductCard from "components/ProductCard";

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { GetProductById, GetProductImages, AllProducts } = useProducts();

  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [relatedItems, setRelatedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const { data: productData } = await GetProductById(productId);
      const { data: imageData } = await GetProductImages(productId);

      if (productData) setProduct(productData);
      if (imageData?.length) {
        setImages(imageData);
        setSelectedImage(imageData[0]);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      const { data: all } = await AllProducts();
      if (!all) return;

      const related = all
        .filter(
          (p) =>
            p.category?.name === product.category?.name &&
            p.product_id !== product.product_id
        )
        .slice(0, 4)
        .map((p) => ({
          id: p.product_id,
          title: p.name,
          price: p.price,
          oldPrice: `$${(p.price * 1.2).toFixed(2)}`,
          discount: "20%",
          image: p.image,
          reviews: Math.floor(Math.random() * 5) + 1,
        }));

      setRelatedItems(related);
    };

    fetchRelated();
  }, [product]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="text-sm text-white mb-4">
        Home / Shop /{" "}
        <span className="text-[#17C3B2] font-semibold">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-[60%]">
          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-6">
            <div className="flex sm:flex-col sm:space-y-4 space-x-4 sm:space-x-0 overflow-x-auto sm:overflow-visible pr-2">
              {images.map((img, index) => (
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
            <div className="bg-gray-100 rounded overflow-hidden flex items-center justify-center w-full h-[300px] sm:h-[500px]">
              <img
                src={selectedImage}
                alt="Selected Product"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[40%]">
          <ProductFullDetails
            product={product}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>

      <div className="mt-12">
        <Heading
          title="Related Items"
          subtitle="You may also like"
          variant="none"
        />

        <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedItems.map((item) => (
            <ProductCard
              key={item.id}
              image={item.image}
              price={item.price}
              rating={item.reviews}
              name={item.title}
              oldPrice={item.oldPrice}
              productId={item.id}
              badge={item.discount}
              featured={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
