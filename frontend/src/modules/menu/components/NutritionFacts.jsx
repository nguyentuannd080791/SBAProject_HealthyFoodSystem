import { Card, Table } from "react-bootstrap";

export function NutritionFacts({ nutrition }) {
  return (
    <Card className="border-success-subtle mb-4">
      <Card.Header className="bg-success-subtle">
        <h2 className="h5 mb-1">Thông tin dinh dưỡng</h2>
        <span className="small text-muted">Giá trị ước tính trên 1 khẩu phần</span>
      </Card.Header>
      <Table className="mb-0">
        <tbody>
          <tr><th scope="row" className="ps-3">Calories</th><td className="text-end pe-3 fw-bold text-success">{nutrition.calories} kcal</td></tr>
          <tr><th scope="row" className="ps-3">Protein (đạm)</th><td className="text-end pe-3">{nutrition.protein} g</td></tr>
          <tr><th scope="row" className="ps-3">Carbs (tinh bột)</th><td className="text-end pe-3">{nutrition.carbs} g</td></tr>
          <tr><th scope="row" className="ps-3">Fat (chất béo)</th><td className="text-end pe-3">{nutrition.fat} g</td></tr>
        </tbody>
      </Table>
    </Card>
  );
}
