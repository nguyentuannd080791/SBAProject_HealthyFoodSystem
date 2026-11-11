import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import {
  CartIcon,
  CheckIcon,
  HeartPulseIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
} from "../../../shared/components/Icons";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { nutritionApi } from "../api/nutritionApi";
import { screeningApi } from "../../screening/api/screeningApi";
import { MealSlotCard } from "../components/MealSlotCard";
import { MetricsSummaryCard } from "../components/MetricsSummaryCard";
import "../styles/nutrition.css";

const STORAGE_PREFIX = "healthy_food_meal_plan_";

export function MealPlanPage() {
  const { user } = useAuth();
  const location = useLocation();
  const { addToCart, items } = useCart();

  const [profileResults, setProfileResults] = useState(
    location.state?.results || null
  );
  const [mealPlan, setMealPlan] = useState(null);
  const [screeningMap, setScreeningMap] = useState(new Map());
  const [savedTimestamp, setSavedTimestamp] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [planError, setPlanError] = useState("");
  const [addingSlot, setAddingSlot] = useState({});
  const [addedSlot, setAddedSlot] = useState({});
  const [bulkAdding, setBulkAdding] = useState(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState("");
  const [unsafeConfirmItem, setUnsafeConfirmItem] = useState(null);

  const storageKey = user?.email ? `${STORAGE_PREFIX}${user.email}` : null;

  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;

    async function loadData() {
      setLoadingProfile(true);
      const [profileRes, screeningResults] = await Promise.all([
        nutritionApi.getMyProfile().catch(() => null),
        screeningApi.evaluateCatalog().catch(() => []),
      ]);

      if (!isMounted) return;
      setLoadingProfile(false);

      if (screeningResults) {
        setScreeningMap(
          new Map(screeningResults.map((r) => [r.productId, r]))
        );
      }

      let currentResults = profileRes?.data || location.state?.results;
      if (currentResults) {
        setProfileResults(currentResults);
      }

      if (!currentResults) {
        return;
      }

      const forceRegenerate = Boolean(location.state?.regenerate);
      let cached = null;

      if (storageKey) {
        try {
          const raw = window.localStorage.getItem(storageKey);
          if (raw) cached = JSON.parse(raw);
        } catch {
          cached = null;
        }
      }

      if (forceRegenerate || !cached?.mealPlan) {
        await executeGeneration();
      } else {
        setMealPlan(cached.mealPlan);
        setSavedTimestamp(cached.savedAt);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.email, location.state]);

  async function executeGeneration() {
    setLoadingPlan(true);
    setPlanError("");
    setBulkSuccessMsg("");

    const [res, screeningResults] = await Promise.all([
      nutritionApi.generateMealPlan(),
      screeningApi.evaluateCatalog().catch(() => []),
    ]);

    setLoadingPlan(false);

    if (screeningResults) {
      setScreeningMap(new Map(screeningResults.map((r) => [r.productId, r])));
    }

    if (res.error) {
      setPlanError(res.error);
    } else if (res.data) {
      setMealPlan(res.data);
      const now = new Date().toISOString();
      setSavedTimestamp(now);
      if (storageKey) {
        try {
          window.localStorage.setItem(
            storageKey,
            JSON.stringify({ savedAt: now, mealPlan: res.data })
          );
        } catch {
        }
      }
    }
  }

  async function doAddToCart(dish) {
    if (!dish?.productId) return;
    const id = dish.productId;
    setAddingSlot((prev) => ({ ...prev, [id]: true }));
    const res = await addToCart(
      {
        id,
        name: dish.productName,
        price: dish.price,
        imageUrl: dish.imageUrl,
      },
      1
    );
    setAddingSlot((prev) => ({ ...prev, [id]: false }));

    if (!res?.error) {
      setAddedSlot((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setAddedSlot((prev) => ({ ...prev, [id]: false }));
      }, 2500);
    }
  }

  function handleAddSingle(dish, screeningResult) {
    const isUnsafe = Boolean(
      screeningResult && !screeningResult.isSafe && !screeningResult.safe
    );
    if (isUnsafe) {
      setUnsafeConfirmItem({ dish, screeningResult });
      return;
    }
    doAddToCart(dish);
  }

  async function handleAddAllMeals() {
    if (!mealPlan?.meals?.length) return;
    setBulkAdding(true);
    setBulkSuccessMsg("");

    for (const m of mealPlan.meals) {
      if (m.dish?.productId) {
        await addToCart(
          {
            id: m.dish.productId,
            name: m.dish.productName,
            price: m.dish.price,
            imageUrl: m.dish.imageUrl,
          },
          1
        );
      }
    }

    setBulkAdding(false);
    setBulkSuccessMsg("Đã thêm toàn bộ thực đơn 3 bữa vào giỏ hàng thành công!");
    setTimeout(() => {
      setBulkSuccessMsg("");
    }, 4500);
  }

  function formatSavedDate(isoString) {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")} ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
      return "";
    }
  }

  const unsafeDishes =
    mealPlan?.meals?.filter((m) => {
      const r = screeningMap.get(m.dish?.productId);
      return r && !r.isSafe && !r.safe;
    }) || [];
  const hasUnsafeDishes = unsafeDishes.length > 0;

  return (
    <div className="nutrition-plan-page pb-5">
      <Container fluid="lg" className="pt-2">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pt-2">
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/nutrition"
              className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1"
            >
              <HeartPulseIcon size={14} /> Đo chỉ số cơ thể
            </Link>
            <span className="text-muted small">/</span>
            <span className="small text-dark fw-semibold">Thực đơn dinh dưỡng</span>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {savedTimestamp && !loadingPlan && (
              <span className="small text-muted font-monospace me-2">
                Lưu lúc: {formatSavedDate(savedTimestamp)}
              </span>
            )}

            <Button
              variant="outline-success"
              size="sm"
              onClick={executeGeneration}
              disabled={loadingPlan}
              className="d-flex align-items-center gap-1 px-3 py-1 fw-semibold"
            >
              <RotateCcwIcon size={14} />
              <span>{loadingPlan ? "Đang tối ưu..." : "Tạo lại thực đơn"}</span>
            </Button>
          </div>
        </div>

        {bulkSuccessMsg && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setBulkSuccessMsg("")}
            className="mb-4 shadow-sm"
          >
            <div className="d-flex align-items-center gap-2 pe-4">
              <CheckIcon size={18} className="text-success flex-shrink-0" />
              <span>{bulkSuccessMsg}</span>
            </div>
          </Alert>
        )}

        {planError && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setPlanError("")}
            className="mb-4 shadow-sm"
          >
            <div className="pe-4">
              <div className="fw-bold mb-1">Không thể tạo thực đơn</div>
              <p className="mb-2 small">{planError}</p>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={executeGeneration}
                  disabled={loadingPlan}
                >
                  Thử lại
                </Button>
                <Link to="/nutrition" className="btn btn-sm btn-danger text-white">
                  Đến trang đo chỉ số cơ thể
                </Link>
              </div>
            </div>
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={4} className="nutrition-plan-sidebar-col">
            <div className="nutrition-plan-sticky-sidebar">
              {loadingProfile ? (
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <Spinner animation="border" variant="success" size="sm" />
                  <p className="text-muted small mt-2 mb-0">
                    Đang tải thông số thể trạng...
                  </p>
                </div>
              ) : (
                <MetricsSummaryCard results={profileResults} />
              )}
            </div>
          </Col>

          <Col lg={8}>
            {loadingPlan ? (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
                <Spinner
                  animation="border"
                  variant="success"
                  style={{ width: "3rem", height: "3rem" }}
                  className="mb-3"
                />
                <h5 className="fw-bold text-dark">
                  Đang tối ưu thực đơn 3 bữa cho bạn...
                </h5>
                <p className="text-muted small max-w-md mx-auto mb-0">
                  Hệ thống đang sàng lọc danh mục theo tình trạng sức khỏe, loại bỏ
                  chất gây dị ứng và áp dụng thuật toán Beam Search để tìm tổ hợp
                  món ăn khớp calo &amp; đa lượng chất nhất.
                </p>
              </div>
            ) : mealPlan ? (
              <div>
                {hasUnsafeDishes && (
                  <Alert variant="danger" className="mb-4 shadow-sm border-danger">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div>
                        <strong className="d-block mb-1 text-danger">
                          ⚠️ Cảnh báo an toàn sức khỏe: Thực đơn có {unsafeDishes.length} món vi phạm bệnh nền / dị ứng mới cập nhật!
                        </strong>
                        <span className="small text-muted">
                          Hồ sơ sức khỏe của bạn đã thay đổi. Hãy bấm tạo lại thực đơn để hệ thống tự động loại trừ các món ăn không còn an toàn.
                        </span>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={executeGeneration}
                        disabled={loadingPlan}
                        className="d-flex align-items-center gap-1 fw-semibold text-nowrap"
                      >
                        <RotateCcwIcon size={14} />
                        <span>Tạo lại thực đơn an toàn</span>
                      </Button>
                    </div>
                  </Alert>
                )}

                <div className="meal-plan-summary-banner p-3 p-md-4 rounded-3 mb-4 shadow-sm">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="success" className="px-2 py-1 fs-6">
                        {mealPlan.goalLabel}
                      </Badge>
                      <span className="text-muted small">
                        Độ khớp calo:{" "}
                        <strong className="text-success">
                          {mealPlan.accuracyPercentage}%
                        </strong>
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted">Tổng thực đơn:</span>
                      <strong className="text-dark fs-5">
                        {mealPlan.totalPrice?.toLocaleString()}đ
                      </strong>
                    </div>
                  </div>

                  <div className="row g-2 text-center">
                    <div className="col-6 col-sm-3">
                      <div className="plan-metric-box">
                        <span className="label">Tổng Calo</span>
                        <span className="value">
                          {mealPlan.actualCaloriesKcal}{" "}
                          <small className="text-muted">
                            / {mealPlan.targetCaloriesKcal}
                          </small>
                        </span>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="plan-metric-box">
                        <span className="label text-success">Đạm (Protein)</span>
                        <span className="value text-success">
                          {mealPlan.actualProteinG}g
                        </span>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="plan-metric-box">
                        <span className="label text-primary">Tinh bột (Carb)</span>
                        <span className="value text-primary">
                          {mealPlan.actualCarbG}g
                        </span>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="plan-metric-box">
                        <span className="label text-warning">Chất béo (Fat)</span>
                        <span className="value text-warning">
                          {mealPlan.actualFatG}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="meal-slots-list mb-4">
                  {mealPlan.meals?.map((m) => {
                    const dish = m.dish;
                    const inCartItem = items.find((i) => i.id === dish?.productId);
                    const cartQty = inCartItem?.quantity ?? 0;
                    const sResult = screeningMap.get(dish?.productId);

                    return (
                      <MealSlotCard
                        key={m.mealType}
                        meal={m}
                        onAddToCart={handleAddSingle}
                        isAdding={Boolean(addingSlot[dish?.productId])}
                        isAdded={Boolean(addedSlot[dish?.productId])}
                        cartQuantity={cartQty}
                        screeningResult={sResult}
                      />
                    );
                  })}
                </div>

                <div className="meal-plan-bottom-actions p-3 bg-white rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-bold text-dark">
                      Đặt trọn bộ thực đơn trong ngày
                    </div>
                    <div className="small text-muted">
                      {hasUnsafeDishes ? (
                        <span className="text-danger fw-semibold">
                          ⚠️ Thực đơn có món vi phạm sức khỏe. Hãy tạo lại thực đơn trước khi đặt cả 3 bữa.
                        </span>
                      ) : (
                        <>
                          3 món ăn đầy đủ cho bữa Sáng, Trưa và Tối •{" "}
                          <strong className="text-success">
                            {mealPlan.totalPrice?.toLocaleString()}đ
                          </strong>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant={hasUnsafeDishes ? "outline-secondary" : "success"}
                      onClick={handleAddAllMeals}
                      disabled={bulkAdding || hasUnsafeDishes}
                      className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                      title={
                        hasUnsafeDishes
                          ? "Vui lòng tạo lại thực đơn an toàn trước khi thêm cả 3 món"
                          : undefined
                      }
                    >
                      {bulkAdding ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          <span>Đang thêm cả 3 món...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBagIcon size={18} />
                          <span>Thêm cả 3 bữa vào giỏ</span>
                        </>
                      )}
                    </Button>

                    <Button
                      as={Link}
                      to="/cart"
                      variant="outline-secondary"
                      className="d-flex align-items-center gap-1 px-3 py-2"
                    >
                      <span>Giỏ hàng</span>
                      <CartIcon size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : !profileResults && !loadingProfile ? (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm p-4">
                <HeartPulseIcon size={44} className="text-warning mb-3" />
                <h5 className="fw-bold text-dark">Chưa có chỉ số cơ thể</h5>
                <p className="text-muted small max-w-md mx-auto mb-3">
                  Vui lòng nhập và lưu chỉ số cơ thể trước khi xây dựng thực đơn dinh dưỡng.
                </p>
                <Link to="/nutrition" className="btn btn-success fw-semibold px-4 py-2">
                  Đến trang đo chỉ số cơ thể
                </Link>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>

      <ConfirmDialog
        show={Boolean(unsafeConfirmItem)}
        title="Cảnh báo an toàn sức khỏe"
        message={`Món ăn "${unsafeConfirmItem?.dish?.productName}" không phù hợp với hồ sơ sức khỏe của bạn (${
          unsafeConfirmItem?.screeningResult?.warningSummary ||
          "vi phạm dị ứng / bệnh nền"
        }). Bạn có chắc chắn vẫn muốn thêm vào giỏ hàng không?`}
        confirmLabel="Vẫn thêm vào giỏ"
        onConfirm={() => {
          const d = unsafeConfirmItem.dish;
          setUnsafeConfirmItem(null);
          doAddToCart(d);
        }}
        onCancel={() => setUnsafeConfirmItem(null)}
      />
    </div>
  );
}
