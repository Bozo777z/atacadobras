import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'kids_wholesale_cart_v1';

const MIN_WHolesale_TOTAL = 6; // default minimum when clothing or set present

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [shippingState, setShippingState] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed.items || []);
        setShippingState(parsed.shippingState || null);
        setShippingMethod(parsed.shippingMethod || null);
      }
    } catch (e) {
      console.error('Failed to restore cart', e);
    }
  }, []);

  useEffect(() => {
    const payload = { items, shippingState, shippingMethod };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [items, shippingState, shippingMethod]);

  function addItem(product, selectedSize, qty = 1) {
    // product must include: id, name, productType
    const existingIndex = items.findIndex(
      (it) => it.productId === product.id && it.size === selectedSize
    );

    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].qty += qty;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          name: product.name,
          productType: product.productType,
          size: selectedSize,
          qty
        }
      ]);
    }
  }

  function updateQty(productId, size, qty) {
    const updated = items.map((it) =>
      it.productId === productId && it.size === size ? { ...it, qty } : it
    ).filter(it => it.qty > 0);
    setItems(updated);
  }

  function removeItem(productId, size) {
    setItems(items.filter((it) => !(it.productId === productId && it.size === size)));
  }

  function clearCart() {
    setItems([]);
    setShippingState(null);
    setShippingMethod(null);
  }

  function containsClothingOrSet() {
    // productType: 'clothing', 'set', 'item'
    return items.some((it) => it.productType === 'clothing' || it.productType === 'set');
  }

  function clothingSetTotalQty() {
    return items.reduce((sum, it) => {
      if (it.productType === 'clothing' || it.productType === 'set') {
        return sum + Number(it.qty || 0);
      }
      return sum;
    }, 0);
  }

  function canCheckout() {
    if (containsClothingOrSet()) {
      return clothingSetTotalQty() >= MIN_WHolesale_TOTAL;
    }
    return true;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        shippingState,
        setShippingState,
        shippingMethod,
        setShippingMethod,
        canCheckout,
        clothingSetTotalQty
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
