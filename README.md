# CarbonFlow

탄소 배출량(PCF, Product Carbon Footprint)을 계산하고 시각화하는 웹 기반 SaaS 대시보드 프로젝트입니다.

회사에서 제공한 활동 데이터를 기반으로 전기, 원소재, 운송 데이터를 분석하고 제품 탄소발자국을 계산해 대시보드 형태로 시각화합니다.

추가로 원하는 파일을 + Add data로 업로드하면 페이지넘버로 추가 대시보드를 확인할 수 있습니다.

---

# 주요 기능

- PCF(Product Carbon Footprint) 계산
- Scope 2 / Scope 3 분류
- 활동 유형별 배출량 시각화
- 월별 배출량 추이 표시
- Excel 업로드 기반 데이터셋 추가
- Dataset 전환 기능
- 계산 결과 테이블 제공

---

# 계산 방식

```text
탄소배출량 = 활동량 × 배출계수
```

예시:

```text
전기 110kWh × 0.456 = 50.16kgCO₂e
```

### Scope 분류

- Scope 2 → 전기 사용
- Scope 3 → 원소재 및 운송

---

# 기술 스택

- Next.js
- React
- TypeScript
- CSS Module
- xlsx

---

# 프로젝트 구조

```text
app/
- page.tsx
- globals.css

src/types/
- emission.ts

src/data/
- activity-data.ts
- emission-factors.ts

src/lib/
- carbon.ts
- excel.ts

src/components/
- Header.tsx
- Dashboard.tsx
- UploadModal.tsx

src/styles/
- Dashboard.module.css
```

---

# 시스템 흐름

```text
Excel 데이터
↓
activity-data.ts
↓
emission-factors.ts와 매칭
↓
carbon.ts에서 탄소 계산
↓
Dashboard.tsx에서 시각화
```

---

# 설계 내용

- 계산 로직과 UI를 분리해 유지보수성과 재사용성을 고려했습니다.
- 배출계수를 활동 데이터와 분리해 향후 DB 확장이 가능하도록 설계했습니다.
- 업로드 데이터를 Dataset 단위로 관리해 여러 데이터셋을 전환할 수 있도록 구성했습니다.

---

# AI 사용 내역

- 디자인/UI 구조 초안 생성
- 민트 색감 기반 SaaS UI 디자인 요청
- Figma의 html to design 플러그인을 통해 UI 확인 후 CSS 작업
- `carbon.ts` 계산 로직 작성 보조

AI가 생성한 코드는 과제 요구사항과 데이터 구조에 맞게 수정 및 검토했습니다.

---

# 실행 방법

## 1. 프로젝트 클론

```bash
git clone <repository-url>
```

## 2. 프로젝트 이동

```bash
cd carbonflow
```

## 3. 패키지 설치

```bash
npm install
```

## 4. 개발 서버 실행

```bash
npm run dev
```

## 5. 브라우저 접속

```text
http://localhost:3000
```
