// src/data/emission-factors.ts
// 탄소 계산 공식에 쓰는 숫자표.
// 과제 요구사항에 따라 활동 데이터와 배출계수를 분리했습니다.
// 실제 서비스에서는 이 데이터가 DB의 emission_factors 테이블로 관리될 수 있습니다.

import type { EmissionFactor } from "@/types/emission";

export const emissionFactors: EmissionFactor[] = [
  {
    id: "ef-001",
    activityType: "전기",
    description: "한국전력",
    factor: 0.456,
    unit: "kgCO₂e / kWh",
    version: "2025.1",
    validFrom: "2025-01-01",
  },
  {
    id: "ef-002",
    activityType: "원소재",
    description: "플라스틱 1",
    factor: 2.3,
    unit: "kgCO₂e / kg",
    version: "2025.1",
    validFrom: "2025-01-01",
  },
  {
    id: "ef-003",
    activityType: "원소재",
    description: "플라스틱 2",
    factor: 3.2,
    unit: "kgCO₂e / kg",
    version: "2025.1",
    validFrom: "2025-01-01",
  },
  {
    id: "ef-004",
    activityType: "운송",
    description: "트럭",
    factor: 3.5,
    unit: "kgCO₂e / ton-km",
    version: "2025.1",
    validFrom: "2025-01-01",
  },
];
