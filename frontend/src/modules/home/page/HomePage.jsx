// src/modules/home/pages/HomePage.jsx
import { useState, lazy, Suspense } from "react";
import { Alert } from "react-bootstrap";
import { HeroBanner } from "../components/HeroBanner";
import { FeaturedMealList } from "../components/FeaturedMealList";
import { MealPlanSection } from "../components/MealPlanSection";
import { DeliveryProcessSection } from "../components/DeliveryProcessSection";
import { HomeFooter } from "../components/HomeFooter";
import { DEFAULT_MEAL_CATALOG } from "../utils/mealModels";

export function HomePage({
  catalog = DEFAULT_MEAL_CATALOG,
  onSelectMeal,
  onSelectPlan,
}) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [notification, setNotification] = useState("");

  const filteredMeals = catalog.filterBy(selectedCategory, searchKeyword);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMealSelection = (meal) => {
    setNotification(`Đã chọn món: ${meal.title} (${meal.price.format()})`);
    onSelectMeal?.(meal);
  };

  const handlePlanSelection = (plan) => {
    setNotification(`Đã chọn đăng ký: ${plan.name} (${plan.price.format()})`);
    onSelectPlan?.(plan);
  };

  return (
    <>
      {notification && (
        <Alert
          variant="success"
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

      <FeaturedMealList
        meals={filteredMeals}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSelectMeal={handleMealSelection}
      />

      <MealPlanSection onSelectPlan={handlePlanSelection} />
      <DeliveryProcessSection />
      <HomeFooter />
    </>
  );
}
