import React, { useEffect, useRef, useState } from "react";
import ProductDetailsCard from "components/ProductDetailsCard";
import TotalCard from "components/TotalCard";
import useAuth from "hooks/useAuth";
import useCart from "hooks/useCart";
import useProducts from "hooks/useProducts";
import Alert from "components/Alert";
import ClipLoader from "react-spinners/ClipLoader";

export default function Cart() {
  const { user } = useAuth();
  const { getCart, isLoading, updateCartItem } = useCart();
  const { GetProductById } = useProducts();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState<{
    type: "info" | "success" | "warning" | "danger";
    title: string;
    description: string;
  }>({
    type: "info",
    title: "Cart Loaded",
    description: "Product details have been successfully loaded.",
  });

  const tempQuantitiesRef = useRef<number[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const { data, err } = await getCart(user?.id);
      if (err) return;

      setCartItems(data || []);
      tempQuantitiesRef.current = (data || []).map(
        (item: any) => item.quantity
      );

      const detailedProducts = await Promise.all(
        (data || []).map(async (item: any) => {
          const { data: productDetails, err } = await GetProductById(
            item.product_id
          );
          if (err) return null;
          return { ...productDetails, quantity: item.quantity };
        })
      );

      setCartProducts(detailedProducts.filter(Boolean));
    };

    fetchCart();
  }, [user?.id]);

  const handleQuantityTempChange = (index: number, newQty: number) => {
    tempQuantitiesRef.current[index] = newQty;
  };

  const handleUpdateCart = async () => {
    setUpdating(true);

    const updated = cartProducts.map((item, i) => ({
      ...item,
      quantity: tempQuantitiesRef.current[i],
    }));

    setCartProducts(updated);

    for (let i = 0; i < updated.length; i++) {
      const product = updated[i];
      const { err } = await updateCartItem(
        product.product_id,
        product.quantity,
        user?.id
      );
      if (err) {
        setAlertContent({
          type: "danger",
          title: "Update Failed",
          description: `Could not update product ${product.name}`,
        });
        setAlertVisible(true);
        setUpdating(false);
        return;
      }
    }

    setAlertContent({
      type: "success",
      title: "Cart Updated",
      description: "Your cart has been successfully updated.",
    });
    setAlertVisible(true);
    setUpdating(false);
  };

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Alert
        isOpen={alertVisible}
        onClose={() => setAlertVisible(false)}
        type={alertContent.type}
        title={alertContent.title}
        description={alertContent.description}
      />

      <div className="text-sm text-gray-500 mb-6">
        Home / Shop / <span className="text-black font-semibold">Cart</span>
      </div>

      {isLoading ? (
        <p>Loading cart...</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {cartProducts.map((item, index) => (
              <ProductDetailsCard
                key={item.product_id}
                product={item}
                quantity={tempQuantitiesRef.current[index]}
                onQuantityChange={(qty) => handleQuantityTempChange(index, qty)}
              />
            ))}
          </div>

          <div className="flex justify-between my-4">
            <button className="px-6 py-2 border border-[#1A2238] font-bold rounded text-sm text-[#666666] hover:bg-[#1A2238] transition hover:text-white">
              Return to Shop
            </button>
            <button
              onClick={handleUpdateCart}
              disabled={updating}
              className="bg-[#007BFF] hover:bg-blue-700 font-bold transition text-white px-6 py-2 rounded text-sm flex items-center gap-2"
            >
              {updating ? <ClipLoader size={16} color="#ffffff" /> : null}
              {updating ? "Updating..." : "Update Cart"}
            </button>
          </div>

          <div className="w-full md:w-1/3">
            <TotalCard subtotal={subtotal} shipping="Free" total={subtotal} />
          </div>
        </>
      )}
    </div>
  );
}
