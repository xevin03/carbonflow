// src/types/emission.ts
// 탄소 계산에 사용되는 데이터 타입을 정의하는 파일입니다.
// 활동 데이터, 배출계수, 계산 결과의 구조를 TypeScript 타입으로 관리합니다.

export type ActivityType = "전기" | "원소재" | "운송";

export type ActivityUnit = "kWh" | "kg" | "ton-km";

export type ScopeType = "Scope 2" | "Scope 3";

export type ActivityRecord = {
  id: string;
  date: string;
  activityType: ActivityType;
  description: string;
  amount: number;
  unit: ActivityUnit;
};

export type EmissionFactor = {
  id: string;
  activityType: ActivityType;
  description: string;
  factor: number;
  unit: string;
  version: string;
  validFrom: string;
};

export type CalculatedEmission = ActivityRecord & {
  factor: number;
  emission: number;
  scope: ScopeType;
};