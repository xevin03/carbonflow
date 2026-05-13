// src/lib/carbon.ts
// 탄소 배출량 계산 로직
// 활동 데이터와 배출계수를 매칭한 뒤,
// 활동량 × 배출계수 = 탄소배출량 계산을 수행합니다.

import type {
  ActivityRecord,
  ActivityType,
  CalculatedEmission,
  EmissionFactor,
  ScopeType,
} from "@/types/emission";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function getScope(activityType: ActivityType): ScopeType {
  if (activityType === "전기") {
    return "Scope 2";
  }

  return "Scope 3";
}

export function calculateEmission(
  record: ActivityRecord,
  factors: EmissionFactor[],
): CalculatedEmission {
  const matchedFactor = factors.find(
    (factor) =>
      factor.activityType === record.activityType &&
      factor.description === record.description,
  );

  if (!matchedFactor) {
    throw new Error(
      `배출계수를 찾을 수 없습니다: ${record.activityType} - ${record.description}`,
    );
  }

  return {
    ...record,
    factor: matchedFactor.factor,
    emission: round(record.amount * matchedFactor.factor),
    scope: getScope(record.activityType),
  };
}

export function calculateAllEmissions(
  records: ActivityRecord[],
  factors: EmissionFactor[],
): CalculatedEmission[] {
  return records.map((record) => calculateEmission(record, factors));
}

export function getTotalEmission(records: CalculatedEmission[]) {
  return round(records.reduce((sum, record) => sum + record.emission, 0));
}

export function getEmissionByScope(records: CalculatedEmission[]) {
  return records.reduce(
    (acc, record) => {
      acc[record.scope] = round(acc[record.scope] + record.emission);
      return acc;
    },
    {
      "Scope 2": 0,
      "Scope 3": 0,
    } as Record<ScopeType, number>,
  );
}

export function getEmissionByActivityType(records: CalculatedEmission[]) {
  return records.reduce(
    (acc, record) => {
      acc[record.activityType] = round(
        (acc[record.activityType] ?? 0) + record.emission,
      );
      return acc;
    },
    {} as Record<ActivityType, number>,
  );
}

export function getEmissionByMonth(records: CalculatedEmission[]) {
  return records.reduce(
    (acc, record) => {
      const month = record.date.slice(0, 7);

      acc[month] = round((acc[month] ?? 0) + record.emission);

      return acc;
    },
    {} as Record<string, number>,
  );
}
