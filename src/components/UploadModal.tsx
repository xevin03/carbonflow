// src/components/UploadModal.tsx
// + Add Data 클릭 시 열리는 Excel 업로드 모달입니다.

"use client";

import { useState } from "react";
import { parseActivityExcel } from "@/lib/excel";
import type { ActivityRecord } from "@/types/emission";
import styles from "@/styles/Dashboard.module.css";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (records: ActivityRecord[]) => void;
};

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: UploadModalProps) {
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setError("");
      const records = await parseActivityExcel(file);
      onUpload(records);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "엑셀 파일을 읽는 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Excel 데이터 업로드</h2>
          <button onClick={onClose}>×</button>
        </div>

        <p className={styles.modalDesc}>
          회사 과제용 Excel 형식의 활동 데이터를 업로드하면 대시보드가 해당
          데이터 기준으로 다시 계산됩니다.
        </p>

        <label className={styles.uploadBox}>
          <div className={styles.uploadIcon}>📄</div>
          <p className={styles.uploadTitle}>Excel 파일을 선택하세요</p>
          <p className={styles.uploadText}>.xlsx, .xls 지원</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </label>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}
