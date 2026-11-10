import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useCart } from "../../cart/hooks/useCart";
import { useProducts } from "../../menu/hooks/useProducts";
import { sortMenuCards } from "../../menu/utils/sortMenuCards";
import { bestActivePromotion } from "../../promotion/utils/promotionPricing";
import { HeroBanner } from "../components/HeroBanner";
import { FeaturedMealList } from "../components/FeaturedMealList";
import { MealPlanSection } from "../components/MealPlanSection";
import { DeliveryProcessSection } from "../components/DeliveryProcessSection";
import { HomeFooter } from "../components/HomeFooter";

export function HomePage({ onSelectPlan }) {
  const catalog = useProducts();
  const { items } = useCart();
  const [now, setNow] = useState(0);
  const [notification, setNotification] = useState("");
  const cards = sortMenuCards(catalog.filteredProducts.map((product) => ({
    product,
    promotion: bestActivePromotion(product, catalog.promotions, now),
  })), catalog.sortBy);
  const cartItemsByProduct = new Map(items.map((item) => [String(item.id), item]));

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleAdded(product, quantity) {
    setNotification(`Đã thêm ${quantity} phần ${product.name} vào giỏ hàng.`);
  }

  function handlePlanSelection(plan) {
    setNotification(`Đã chọn đăng ký: ${plan.name} (${plan.price.format()})`);
    onSelectPlan?.(plan);
  }

  return <>
    {notification && <Alert variant="success" dismissible onClose={() => setNotification("")}
      className="mb-4 shadow-sm">{notification}</Alert>}

    <HeroBanner onExploreMenu={() => scrollToSection("featured-meals")}
      onExplorePlans={() => scrollToSection("meal-plans")} />

    <FeaturedMealList catalog={catalog} cards={cards} cartItemsByProduct={cartItemsByProduct}
      onAdded={handleAdded} />

    <MealPlanSection onSelectPlan={handlePlanSelection} />
    <DeliveryProcessSection />
    <HomeFooter />
  </>;
}
