import { useMemo, useState } from "react";
import { mockProducts, productCategories } from "../data/mockProducts";
import { filterProducts } from "../utils/filterProducts";

export function useProducts() {
  const [products] = useState(mockProducts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxCalories, setMaxCalories] = useState("");
  const [sortBy, setSortBy] = useState("default");
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
    products, filteredProducts, categories: productCategories,
    searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory,
    maxCalories, setMaxCalories, sortBy, setSortBy, resetFilters,
  };
}
