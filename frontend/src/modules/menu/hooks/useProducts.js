import { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/productApi";
import { filterProducts } from "../utils/filterProducts";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxCalories, setMaxCalories] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let active = true;
    productApi.list().then((result) => {
      if (!active) return;
      if (result.error) setError(result.error);
      else {
        setProducts(result.data);
        setCategories(result.categories);
        setError("");
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  const filteredProducts = useMemo(() => filterProducts(products, {
    searchKeyword, selectedCategory, maxCalories, sortBy,
  }), [products, searchKeyword, selectedCategory, maxCalories, sortBy]);

  function resetFilters() {
    setSearchKeyword("");
    setSelectedCategory("all");
    setMaxCalories("");
    setSortBy("default");
  }

  return {
    products, filteredProducts, categories, loading, error,
    searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory,
    maxCalories, setMaxCalories, sortBy, setSortBy, resetFilters,
  };
}
