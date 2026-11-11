import { useEffect, useState } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { nutritionApi } from "../api/nutritionApi";

export const ACTIVITY_OPTIONS = [
  {
    code: "SEDENTARY",
    label: "Ít vận động",
    desc: "Làm việc văn phòng, ít hoặc không tập thể thao",
  },
  {
    code: "LIGHTLY_ACTIVE",
    label: "Vận động nhẹ",
    desc: "Tập luyện thể thao nhẹ nhàng 1 - 3 buổi/tuần",
  },
  {
    code: "MODERATELY_ACTIVE",
    label: "Vận động vừa",
    desc: "Tập luyện thể dục thể thao 3 - 5 buổi/tuần",
  },
  {
    code: "VERY_ACTIVE",
    label: "Vận động nhiều",
    desc: "Tập luyện chăm chỉ 6 - 7 buổi/tuần",
  },
  {
    code: "EXTRA_ACTIVE",
    label: "Rất nhiều",
    desc: "Vận động viên hoặc lao động thể lực cường độ cao",
  },
];

export const GOAL_OPTIONS = [
  {
    code: "LOSE_WEIGHT",
    label: "Giảm cân",
    desc: "Thâm hụt -500 kcal/ngày để giảm mỡ an toàn",
  },
  {
    code: "MAINTAIN",
    label: "Duy trì vóc dáng",
    desc: "Cân bằng năng lượng giữ ổn định cân nặng",
  },
  {
    code: "GAIN_WEIGHT",
    label: "Tăng cân",
    desc: "Thặng dư +500 kcal/ngày để phát triển cân nặng & cơ",
  },
];

export function useBodyMetrics() {
  const { user } = useAuth();
  const storageKey = `healthyfood_metrics_${user?.id || user?.email || "guest"}`;

  const [gender, setGender] = useState("MALE");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [age, setAge] = useState("");
  const [activityLevel, setActivityLevel] = useState("MODERATELY_ACTIVE");
  const [goal, setGoal] = useState("MAINTAIN");

  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProfile() {
      if (user) {
        try {
          const remoteProfile = await nutritionApi.getMyProfile();
          if (isMounted && remoteProfile?.data) {
            const data = remoteProfile.data;
            if (data.gender) setGender(data.gender);
            if (data.heightCm) setHeightCm(String(data.heightCm));
            if (data.weightKg) setWeightKg(String(data.weightKg));
            if (data.age) setAge(String(data.age));
            if (data.activityLevel) setActivityLevel(data.activityLevel);
            if (data.goal) setGoal(data.goal);
            if (data.isProfileLocked || (data.heightCm && data.age && data.gender)) {
              setIsProfileLocked(true);
            }
            setResults(data);
            return;
          }
        } catch {}
      }

      try {
        const saved = localStorage.getItem(storageKey);
        if (isMounted && saved) {
          const parsed = JSON.parse(saved);
          if (parsed.gender) setGender(parsed.gender);
          if (parsed.heightCm) setHeightCm(String(parsed.heightCm));
          if (parsed.weightKg) setWeightKg(String(parsed.weightKg));
          if (parsed.age) setAge(String(parsed.age));
          if (parsed.activityLevel) setActivityLevel(parsed.activityLevel);
          if (parsed.goal) setGoal(parsed.goal);

          if (parsed.isProfileLocked || (parsed.heightCm && parsed.age && parsed.gender)) {
            setIsProfileLocked(true);
          }

          if (parsed.lastResults) {
            setResults(parsed.lastResults);
          }
        }
      } catch {}
    }

    loadInitialProfile();

    return () => {
      isMounted = false;
    };
  }, [storageKey, user]);

  async function calculate(event) {
    if (event) event.preventDefault();
    setError("");
    setSuccessMsg("");

    const parsedHeight = parseFloat(heightCm);
    const parsedWeight = parseFloat(weightKg);
    const parsedAge = parseInt(age, 10);

    if (isNaN(parsedHeight) || parsedHeight < 50 || parsedHeight > 250) {
      setError("Vui lòng nhập chiều cao hợp lệ từ 50cm đến 250cm.");
      return;
    }
    if (isNaN(parsedWeight) || parsedWeight < 20 || parsedWeight > 300) {
      setError("Vui lòng nhập cân nặng hợp lệ từ 20kg đến 300kg.");
      return;
    }
    if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 120) {
      setError("Vui lòng nhập tuổi hợp lệ từ 10 đến 120 tuổi.");
      return;
    }

    setLoading(true);

    const payload = {
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      age: parsedAge,
      gender,
      activityLevel,
      goal,
    };

    const res = await nutritionApi.calculate(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setResults(res.data);
      setIsProfileLocked(true);
      setSuccessMsg("Đã tính toán thành công và lưu chỉ số thể trạng của bạn!");

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...payload,
            isProfileLocked: true,
            lastResults: res.data,
            savedAt: new Date().toISOString(),
          }),
        );
      } catch {}
    }
    return res;
  }

  return {
    formState: {
      gender,
      setGender,
      heightCm,
      setHeightCm,
      weightKg,
      setWeightKg,
      age,
      setAge,
      activityLevel,
      setActivityLevel,
      goal,
      setGoal,
      isProfileLocked,
      isHeightAgeLocked: isProfileLocked,
    },
    status: {
      loading,
      error,
      setError,
      successMsg,
      setSuccessMsg,
    },
    results,
    calculate,
  };
}
