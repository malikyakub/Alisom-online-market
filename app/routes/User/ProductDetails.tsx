import React, { useState } from "react";
import ProductFullDetails from "components/Productfulldetails";
import FeaturedProductCard from "components/FeaturedProductCard";

interface RelatedItem {
  title: string;
  price: string | number;
  oldPrice: string;
  discount: string;
  image: string;
  reviews: number;
}

const ProductDetails: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const imageList = [
    "https://i.pinimg.com/736x/92/ae/9c/92ae9c10f44fb1f11fc4c49616470ef5.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiU2vaHGs-t25knHbRwVd_iD6157AYwubL8w&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrzlJReoUi5hzGmqYLsFhJRTVR6QtkmM6vfg&s",
    "https://i.pinimg.com/736x/92/ae/9c/92ae9c10f44fb1f11fc4c49616470ef5.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState<string>(imageList[0]);

  const relatedItems: RelatedItem[] = [
    {
      title: "HAVIT HV-G92 Gamepad",
      price: 120,
      oldPrice: "$160",
      discount: "40%",
      image: imageList[2],
      reviews: 4,
    },
    {
      title: "AK-900 Wired Keyboard",
      price: 960,
      oldPrice: "$1110",
      discount: "35%",
      image: imageList[0],
      reviews: 4,
    },
    {
      title: "IPS LCD Gaming Monitor",
      price: 370,
      oldPrice: "$480",
      discount: "30%",
      image: imageList[0],
      reviews: 5,
    },
    {
      title: "RGB liquid CPU Cooler",
      price: 160,
      oldPrice: "$170",
      discount: "",
      image: imageList[0],
      reviews: 4,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home / Shop / Products /{" "}
        <span className="text-black font-semibold">HAVIT HV-G92 Gamepad</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-6">
            {/* Thumbnails */}
            <div className="flex sm:flex-col sm:space-y-4 space-x-4 sm:space-x-0 overflow-x-auto sm:overflow-visible pr-2">
              {imageList.map((img, index) => (
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
          <ProductFullDetails />
        </div>
      </div>

      {/* Related Items Section */}
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
