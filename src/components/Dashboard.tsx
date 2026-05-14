// src/components/Dashboard.tsx
// 회사 제공 데이터와 업로드 데이터를 데이터셋 단위로 관리하고,
// 선택된 데이터셋 기준으로 PCF 대시보드를 보여주는 메인 컴포넌트입니다.

"use client";

import { useState } from "react";
import Header from "./ Header";
import UploadModal from "@/components/UploadModal";
import { activityData } from "@/data/activity-data";
import { emissionFactors } from "@/data/emission-factors";
import {
  calculateAllEmissions,
  getEmissionByActivityType,
  getEmissionByMonth,
  getEmissionByScope,
  getTotalEmission,
} from "@/lib/carbon";
import type { ActivityRecord } from "@/types/emission";
import styles from "@/styles/Dashboard.module.css";

type Dataset = {
  id: string;
  name: string;
  records: ActivityRecord[];
};

const initialDataset: Dataset = {
  id: "dataset-1",
  name: "1",
  records: activityData,
};

export default function Dashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([initialDataset]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(initialDataset.id);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const selectedDataset =
    datasets.find((dataset) => dataset.id === selectedDatasetId) ??
    initialDataset;

  const calculatedData = calculateAllEmissions(
    selectedDataset.records,
    emissionFactors,
  );

  const totalEmission = getTotalEmission(calculatedData);
  const emissionByScope = getEmissionByScope(calculatedData);
  const emissionByActivityType = getEmissionByActivityType(calculatedData);
  const emissionByMonth = getEmissionByMonth(calculatedData);

  const activityEntries = Object.entries(emissionByActivityType);
  const monthEntries = Object.entries(emissionByMonth);

  const maxActivityEmission = Math.max(
    ...activityEntries.map(([, value]) => value),
  );

  const maxMonthlyEmission = Math.max(
    ...monthEntries.map(([, value]) => value),
  );

  const handleUpload = (uploadedRecords: ActivityRecord[]) => {
    const nextNumber = datasets.length + 1;

    const newDataset: Dataset = {
      id: `dataset-${nextNumber}`,
      name: String(nextNumber),
      records: uploadedRecords,
    };

    setDatasets((prev) => [...prev, newDataset]);
    setSelectedDatasetId(newDataset.id);
  };

  return (
    <main className={styles.page}>
      <Header
        datasets={datasets.map(({ id, name }) => ({ id, name }))}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={setSelectedDatasetId}
        onAddDataClick={() => setIsUploadOpen(true)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      <div className={styles.container}>
        <section className={styles.heroGrid}>
          <div className={styles.heroCard}>
            <div className={styles.heroCircle} />

            <div className={styles.heroContent}>
              <span className={styles.badge}>
                ● Dataset {selectedDataset.name} · Product Carbon Footprint
                Dashboard
              </span>

              <h1 className={styles.title}>
                제품별 탄소발자국을 계산하고, 배출 원인을 한눈에 분석합니다.
              </h1>

              <p className={styles.description}>
                현재 선택된 데이터셋을 기준으로 활동 데이터와 배출계수를 매칭해
                PCF를 계산하고, Scope 2·Scope 3, 활동 유형별 배출량, 월별 추이를
                시각화합니다.
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>
              Dataset {selectedDataset.name} · Total Emission
            </p>

            <div className={styles.summaryValue}>
              {totalEmission.toLocaleString()}
            </div>

            <p className={styles.summaryUnit}>kgCO₂e total emission</p>

            <div className={styles.progress}>
              <div className={styles.progressFill} />
            </div>

            <p className={styles.summaryText}>
              기본 1번 데이터셋은 회사 제공 과제 데이터입니다. + Add Data로
              엑셀을 업로드하면 2번, 3번 데이터셋이 추가되어 상단 탭에서 전환할
              수 있습니다.
            </p>
          </div>
        </section>

        <section className={styles.metricGrid}>
          <MetricCard
            label="Total Emission"
            value={totalEmission.toLocaleString()}
            unit="kgCO₂e"
            caption="전체 PCF 계산 결과"
          />
          <MetricCard
            label="Scope 2"
            value={emissionByScope["Scope 2"].toLocaleString()}
            unit="kgCO₂e"
            caption="전기 사용 배출량"
          />
          <MetricCard
            label="Scope 3"
            value={emissionByScope["Scope 3"].toLocaleString()}
            unit="kgCO₂e"
            caption="원소재 + 운송"
          />
          <MetricCard
            label="Records"
            value={calculatedData.length.toString()}
            unit="rows"
            caption={`Dataset ${selectedDataset.name} 활동 데이터`}
          />
        </section>

        <section className={styles.sectionGrid}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>활동 유형별 배출량</h2>
            <p className={styles.sectionDesc}>
              전기, 원소재, 운송 중 어떤 활동이 가장 큰 배출원을 만드는지
              비교합니다.
            </p>

            <div className={styles.barChart}>
              {activityEntries.map(([type, value]) => {
                const height = (value / maxActivityEmission) * 100;

                return (
                  <div key={type} className={styles.barItem}>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ height: `${height}%` }}
                      />
                    </div>

                    <p className={styles.barLabel}>{type}</p>
                    <p className={styles.barValue}>
                      {value.toLocaleString()} kg
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Scope 비율</h2>
            <p className={styles.sectionDesc}>
              전기 사용은 Scope 2, 원소재와 운송은 Scope 3로 분류합니다.
            </p>

            <div className={styles.scopeLayout}>
              <div className={styles.scopeDonut}>
                <div className={styles.scopeDonutInner}>92%</div>
              </div>

              <div>
                <ScopeRow
                  label="Scope 2"
                  value={emissionByScope["Scope 2"]}
                  color="#6ee7b7"
                />
                <ScopeRow
                  label="Scope 3"
                  value={emissionByScope["Scope 3"]}
                  color="#059669"
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cardLarge}>
          <h2 className={styles.sectionTitle}>월별 배출량 추이</h2>
          <p className={styles.sectionDesc}>
            선택된 데이터셋의 월별 활동 데이터 기반 배출량입니다.
          </p>

          <div className={styles.monthList}>
            {monthEntries.map(([month, value]) => (
              <div key={month} className={styles.monthItem}>
                <div className={styles.monthHeader}>
                  <span>{month}</span>
                  <span>{value.toLocaleString()} kgCO₂e</span>
                </div>

                <div className={styles.monthTrack}>
                  <div
                    className={styles.monthFill}
                    style={{
                      width: `${(value / maxMonthlyEmission) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cardLarge}>
          <h2 className={styles.sectionTitle}>계산 결과 테이블</h2>
          <p className={styles.sectionDesc}>
            선택된 데이터셋의 원본 활동 데이터에 배출계수를 매칭한 계산
            결과입니다.
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>일자</th>
                  <th>활동 유형</th>
                  <th>설명</th>
                  <th>량</th>
                  <th>단위</th>
                  <th>배출계수</th>
                  <th>Scope</th>
                  <th>배출량</th>
                </tr>
              </thead>

              <tbody>
                {calculatedData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.activityType}</td>
                    <td>{record.description}</td>
                    <td>{record.amount}</td>
                    <td>{record.unit}</td>
                    <td>{record.factor}</td>
                    <td>
                      <span className={styles.scopeBadge}>{record.scope}</span>
                    </td>
                    <td>{record.emission.toLocaleString()} kgCO₂e</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  unit,
  caption,
}: {
  label: string;
  value: string;
  unit: string;
  caption: string;
}) {
  return (
    <div className={styles.card}>
      <p className={styles.metricLabel}>{label}</p>

      <div className={styles.metricValueWrap}>
        <span className={styles.metricValue}>{value}</span>
        <span className={styles.metricUnit}>{unit}</span>
      </div>

      <p className={styles.metricCaption}>{caption}</p>
    </div>
  );
}

function ScopeRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={styles.scopeRow}>
      <div className={styles.scopeLabelWrap}>
        <span className={styles.scopeDot} style={{ background: color }} />
        <span>{label}</span>
      </div>

      <span className={styles.scopeValue}>{value.toLocaleString()} kg</span>
    </div>
  );
}
