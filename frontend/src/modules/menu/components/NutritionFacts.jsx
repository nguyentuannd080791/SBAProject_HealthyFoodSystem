const number = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

function AppleIcon() {
  return <svg viewBox="0 0 40 40" width="36" height="36" fill="none"
    stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 15c-4-5-12-4-14 3-2 8 3 17 9 17 2 0 3-1 5-1s3 1 5 1c6 0 11-9 9-17-2-7-10-8-14-3Z" />
    <path d="M20 16c-1-7 1-10 5-12M20 13c-2-4-5-5-8-5" />
  </svg>;
}

export function NutritionFacts({ nutrition }) {
  const facts = [
    { label: "Calories", value: `${number.format(nutrition.calories)} kcal` },
    { label: "Protein", value: `${number.format(nutrition.protein)} g` },
    { label: "Carbs", value: `${number.format(nutrition.carbs)} g` },
    { label: "Fat", value: `${number.format(nutrition.fat)} g` },
  ];

  return <section className="product-detail-nutrition" aria-labelledby="product-nutrition-title">
    <div className="product-detail-nutrition-heading">
      <AppleIcon />
      <div>
        <h2 id="product-nutrition-title">Thông tin dinh dưỡng</h2>
        <span>(trên 1 khẩu phần)</span>
      </div>
    </div>
    <dl className="product-detail-nutrition-facts">
      {facts.map(({ label, value }) => <div key={label}>
        <dt>{label}</dt><dd>{value}</dd>
      </div>)}
    </dl>
  </section>;
}
