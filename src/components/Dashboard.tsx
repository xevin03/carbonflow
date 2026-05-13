// src/components/Dashboard.tsx
// 회사 제공 활동 데이터를 계산해 PCF 대시보드로 보여주는 메인 컴포넌트입니다.

"use client";

import Header from "./ Header";
import { activityData } from "@/data/activity-data";
import { emissionFactors } from "@/data/emission-factors";
import {
  calculateAllEmissions,
  getEmissionByActivityType,
  getEmissionByMonth,
  getEmissionByScope,
  getTotalEmission,
} from "@/lib/carbon";
import styles from "@/styles/Dashboard.module.css";

export default function Dashboard() {
  const calculatedData = calculateAllEmissions(activityData, emissionFactors);

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

  const handleAddDataClick = () => {
    alert("엑셀 업로드 기능은 다음 단계에서 연결할 예정입니다.");
  };

  return (
    <main className={styles.page}>
      <Header onAddDataClick={handleAddDataClick} />

      <div className={styles.container}>
        <section className={styles.heroGrid}>
          <div className={styles.heroCard}>
            <div className={styles.heroCircle} />

            <div className={styles.heroContent}>
              <span className={styles.badge}>
                ● Product Carbon Footprint Dashboard
              </span>

              <h1 className={styles.title}>
                제품별 탄소발자국을 계산하고, 배출 원인을 한눈에 분석합니다.
              </h1>

              <p className={styles.description}>
                회사가 제공한 원본 활동 데이터와 배출계수를 매칭해 PCF를
                계산하고, Scope 2·Scope 3, 활동 유형별 배출량, 월별 추이를
                시각화합니다.
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Total Emission</p>

            <div className={styles.summaryValue}>
              {totalEmission.toLocaleString()}
            </div>

            <p className={styles.summaryUnit}>kgCO₂e total emission</p>

            <div className={styles.progress}>
              <div className={styles.progressFill} />
            </div>

            <p className={styles.summaryText}>
              기본 화면은 회사 제공 과제 데이터를 기반으로 표시됩니다. 다른
              데이터를 분석하려면 상단의 + Add Data를 통해 엑셀 업로드 흐름으로
              확장할 수 있습니다.
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
            caption="과제용 활동 데이터"
          />
        </section>

        <section className={styles.sectionGrid}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>활동 유형별 배출량</h2>
            <p className={styles.sectionDesc}>
              전기, 원소재, 운송 중 어떤 활동이 가장 큰 배출원을 만드는지
              비교합니다.
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                alignItems: "end",
                justifyContent: "space-around",
                gap: 24,
                height: 280,
              }}
            >
              {activityEntries.map(([type, value]) => {
                const height = (value / maxActivityEmission) * 100;

                return (
                  <div
                    key={type}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 80,
                        height: 220,
                        borderRadius: 24,
                        border: "1px solid #d1fae5",
                        background: "#ecfdf5",
                        display: "flex",
                        alignItems: "end",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${height}%`,
                          borderRadius: 24,
                          background:
                            "linear-gradient(to top, #059669, #6ee7b7)",
                        }}
                      />
                    </div>

                    <p style={{ marginTop: 16, fontWeight: 900 }}>{type}</p>
                    <p
                      style={{
                        marginTop: 4,
                        color: "#64748b",
                        fontWeight: 700,
                      }}
                    >
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

            <div
              style={{
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 32,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 192,
                  height: 192,
                  borderRadius: "50%",
                  background: "conic-gradient(#059669 0 92%, #a7f3d0 92% 100%)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 48,
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#047857",
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  92%
                </div>
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

        <section className={styles.card} style={{ marginTop: 24 }}>
          <h2 className={styles.sectionTitle}>월별 배출량 추이</h2>
          <p className={styles.sectionDesc}>
            2025년 월별 활동 데이터 기반 배출량입니다.
          </p>

          <div style={{ marginTop: 24 }}>
            {monthEntries.map(([month, value]) => (
              <div key={month} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  <span>{month}</span>
                  <span>{value.toLocaleString()} kgCO₂e</span>
                </div>

                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "#ecfdf5",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(value / maxMonthlyEmission) * 100}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(to right, #6ee7b7, #059669)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card} style={{ marginTop: 24 }}>
          <h2 className={styles.sectionTitle}>계산 결과 테이블</h2>
          <p className={styles.sectionDesc}>
            원본 활동 데이터에 배출계수를 매칭한 계산 결과입니다.
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
      <p style={{ color: "#64748b", fontSize: 14, fontWeight: 900 }}>{label}</p>

      <div style={{ marginTop: 20 }}>
        <span style={{ fontSize: 32, fontWeight: 900 }}>{value}</span>
        <span
          style={{
            marginLeft: 4,
            color: "#64748b",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {unit}
        </span>
      </div>

      <p style={{ marginTop: 12, color: "#047857", fontWeight: 900 }}>
        {caption}
      </p>
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottom: "1px solid #ecfdf5",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
          }}
        />
        <span style={{ fontWeight: 900 }}>{label}</span>
      </div>

      <span style={{ color: "#047857", fontWeight: 900 }}>
        {value.toLocaleString()} kg
      </span>
    </div>
  );
}
