// src/components/Header.tsx
// 상단 헤더 컴포넌트입니다.
// 데이터셋 탭, Export, Add Data 버튼을 담당합니다.

import styles from "@/styles/Dashboard.module.css";

type DatasetTab = {
  id: string;
  name: string;
};

type HeaderProps = {
  datasets: DatasetTab[];
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  onAddDataClick: () => void;
};

export default function Header({
  datasets,
  selectedDatasetId,
  onSelectDataset,
  onAddDataClick,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark} />
          <div className={styles.logoText}>
            Carbon <span>Flow</span>
          </div>
        </div>

        <nav className={styles.datasetTabs}>
          {datasets.map((dataset) => (
            <button
              key={dataset.id}
              className={
                dataset.id === selectedDatasetId
                  ? styles.datasetTabActive
                  : styles.datasetTab
              }
              onClick={() => onSelectDataset(dataset.id)}
            >
              {dataset.name}
            </button>
          ))}
        </nav>

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
