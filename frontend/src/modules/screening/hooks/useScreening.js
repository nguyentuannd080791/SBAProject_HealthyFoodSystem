import { useEffect, useState } from "react";
import { screeningApi } from "../api/screeningApi";

export function useScreening() {
  const [conditions, setConditions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [conds, ings, prof] = await Promise.all([
          screeningApi.getConditions(),
          screeningApi.getIngredients(),
          screeningApi.getUserProfile().catch(() => null),
        ]);
        if (mounted) {
          setConditions(conds || []);
          setIngredients(ings || []);
          setUserProfile(prof);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Không thể tải dữ liệu sàng lọc lâm sàng.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  async function saveProfile(conditionIds, allergicIngredientIds, note) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await screeningApi.saveUserProfile({
        conditionIds,
        allergicIngredientIds,
        note,
      });
      setUserProfile(updated);
      setSuccess("Cập nhật hồ sơ sức khỏe và sàng lọc lâm sàng thành công!");
      return { success: true, data: updated };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Lưu hồ sơ thất bại. Vui lòng thử lại.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }

  return {
    conditions,
    ingredients,
    userProfile,
    loading,
    saving,
    error,
    success,
    setError,
    setSuccess,
    saveProfile,
  };
}
