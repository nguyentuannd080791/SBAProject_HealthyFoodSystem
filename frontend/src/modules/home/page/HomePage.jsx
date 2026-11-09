// src/modules/home/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useCart } from "../../cart/hooks/useCart";
import { productApi } from "../../menu/api/productApi";
import { HeroBanner } from "../components/HeroBanner";
import { FeaturedMealList } from "../components/FeaturedMealList";
import { MealPlanSection } from "../components/MealPlanSection";
import { DeliveryProcessSection } from "../components/DeliveryProcessSection";
import { HomeFooter } from "../components/HomeFooter";
import { DEFAULT_MEAL_CATALOG, Meal, MealCatalog, MacroNutrients, Money, NUTRITION_CATEGORIES } from "../utils/mealModels";

export function HomePage({ onSelectMeal, onSelectPlan }) {
  const { addToCart } = useCart();
  const [serverCatalog, setServerCatalog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [pendingMealId, setPendingMealId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    let active = true;
    productApi.list().then((result) => {
      if (!active) return;
      if (result.error) return setLoadError(result.error);
      const meals = result.data.map((product) => {
        const preview = DEFAULT_MEAL_CATALOG.meals.find((meal) => meal.title === product.name);
        return new Meal({
          id: product.id, title: product.name, description: product.description,
          category: NUTRITION_CATEGORIES.find((item) => item.label === product.categoryName)?.id ?? "ALL",
          weightGrams: preview?.weightGrams ?? 0,
          macros: new MacroNutrients(product.nutrition.calories, product.nutrition.protein,
            product.nutrition.carbs, product.nutrition.fat),
          price: new Money(product.price), imageUrl: product.image,
          isBestSeller: preview?.isBestSeller ?? false,
        });
      });
      setServerCatalog(new MealCatalog(meals));
      setLoadError("");
    });
    return () => { active = false; };
  }, []);

  const filteredMeals = (serverCatalog ?? new MealCatalog())
    .filterBy(selectedCategory, searchKeyword);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMealSelection = async (meal) => {
    if (pendingMealId !== null) return;
    setPendingMealId(meal.id);
    const result = await addToCart({
      id: meal.id, name: meal.title, price: meal.price.amount, image: meal.imageUrl,
      nutrition: { calories: meal.macros.calories, protein: meal.macros.proteinGrams,
        carbs: meal.macros.carbsGrams, fat: meal.macros.fatGrams },
    }, 1);
    setPendingMealId(null);
    setNotificationType(result.error ? "danger" : "success");
    setNotification(result.error || `Đã thêm 1 phần ${meal.title} vào giỏ hàng.`);
    if (result.error) return;
    onSelectMeal?.(meal);
  };

  const handlePlanSelection = (plan) => {
    setNotificationType("success");
    setNotification(`Đã chọn đăng ký: ${plan.name} (${plan.price.format()})`);
    onSelectPlan?.(plan);
  };

  return (
    <>
      {notification && (
        <Alert
          variant={notificationType}
          dismissible
          onClose={() => setNotification("")}
          className="mb-4 shadow-sm"
        >
          {notification}
        </Alert>
      )}

      <HeroBanner
        onExploreMenu={() => scrollToSection("featured-meals")}
        onExplorePlans={() => scrollToSection("meal-plans")}
      />

      {loadError && <Alert variant="danger">Không tải được thực đơn: {loadError}</Alert>}
      {!serverCatalog && !loadError && <p role="status">Đang tải thực đơn…</p>}

      <FeaturedMealList
        meals={filteredMeals}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSelectMeal={handleMealSelection}
        pendingMealId={pendingMealId}
      />

      <MealPlanSection onSelectPlan={handlePlanSelection} />
      <DeliveryProcessSection />
      <HomeFooter />
    </>
  );
}
