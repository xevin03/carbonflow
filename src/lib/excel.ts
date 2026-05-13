// src/lib/excel.ts
// Excel 파일을 읽어서 ActivityRecord 배열로 변환하는 유틸 함수입니다.

import * as XLSX from "xlsx";
import type {
  ActivityRecord,
  ActivityType,
  ActivityUnit,
} from "@/types/emission";

const VALID_ACTIVITY_TYPES: ActivityType[] = ["전기", "원소재", "운송"];
const VALID_UNITS: ActivityUnit[] = ["kWh", "kg", "ton-km"];

function formatExcelDate(value: unknown): string {
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    const month = String(parsed.m).padStart(2, "0");
    const day = String(parsed.d).padStart(2, "0");
    return `${parsed.y}-${month}-${day}`;
  }

  if (typeof value === "string") {
    return value.trim().slice(0, 10);
  }

  return "";
}

export async function parseActivityExcel(
  file: File,
): Promise<ActivityRecord[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
    header: 1,
    defval: "",
  });

  const headerIndex = rows.findIndex(
    (row) => row.includes("일자(원본)") && row.includes("활동 유형"),
  );

  if (headerIndex === -1) {
    throw new Error("엑셀에서 활동 데이터 헤더를 찾을 수 없습니다.");
  }

  const header = rows[headerIndex] as string[];

  const dateIndex = header.indexOf("일자(원본)");
  const typeIndex = header.indexOf("활동 유형");
  const descIndex = header.indexOf("설명");
  const amountIndex = header.indexOf("량");
  const unitIndex = header.indexOf("단위");

  const records: ActivityRecord[] = [];

  rows.slice(headerIndex + 1).forEach((row, index) => {
    const date = formatExcelDate(row[dateIndex]);
    const activityType = String(row[typeIndex]).trim() as ActivityType;
    const description = String(row[descIndex]).trim();
    const amount = Number(row[amountIndex]);
    const unit = String(row[unitIndex]).trim() as ActivityUnit;

    if (!date && !activityType && !description) return;

    if (!VALID_ACTIVITY_TYPES.includes(activityType)) return;

    if (!VALID_UNITS.includes(unit)) {
      throw new Error(`${index + 1}번째 데이터의 단위가 올바르지 않습니다.`);
    }

    if (!amount || amount <= 0) {
      throw new Error(`${index + 1}번째 데이터의 량은 0보다 커야 합니다.`);
    }

    records.push({
      id: `uploaded-${index + 1}`,
      date,
      activityType,
      description,
      amount,
      unit,
    });
  });

  if (records.length === 0) {
    throw new Error("업로드 가능한 활동 데이터가 없습니다.");
  }

  return records;
}
