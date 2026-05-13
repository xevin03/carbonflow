// src/components/Header.tsx
// 대시보드 상단 헤더 컴포넌트입니다.
// Export, Add Data 같은 전역 액션 버튼을 담당합니다.

import styles from "@/styles/Dashboard.module.css";

type HeaderProps = {
  onAddDataClick?: () => void;
};

export default function Header({ onAddDataClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark} />
          <div className={styles.logoText}>
            Carbon <span>Flow</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.outlineButton}>Export</button>
          <button className={styles.primaryButton} onClick={onAddDataClick}>
            + Add Data
          </button>
        </div>
      </div>
    </header>
  );
}
