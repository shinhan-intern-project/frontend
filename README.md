# StockPort
<img width="1411" alt="image" src="https://github.com/user-attachments/assets/733023b7-e37c-41c1-8049-eeeaf3536d3e" />

## 📖 소개
**StockPort**는 HS 코드를 기반으로 수출입 통계와 주식 데이터를 연결하여, 투자자에게 새로운 인사이트를 제공하는 시각화 플랫폼입니다.  
- 종목-품목 매핑 정보를 네트워크 그래프와 3D 지구본으로 직관적으로 탐색  
- AI 자동 분류 및 전문가 검수를 통해 HS 코드 추천 및 라벨링

## 문제인식 및 배경
 <img width="1388" alt="image" src="https://github.com/user-attachments/assets/e68b8846-7dfe-4497-8707-c89369ee7c48" />
 <img width="1410" alt="image" src="https://github.com/user-attachments/assets/6c97a3f0-f104-4222-aba5-33d1b3fb5477" />


## 🚀 주요 기능
- **네트워크 그래프 시각화**  
  - BFS(너비 우선 탐색) 로직으로 빠른 연결 탐색  
  - Canvas 기반 ForceGraph2D 렌더링으로 대량 노드·엣지 처리 최적화
- **3D 지구본 구현**  
  - three.js를 활용한 글로벌 무역 현황 실시간 시각화
- **품목 검색 자동 분류**  
  - AI 상품명 자동분류 API로 키워드에 적합한 HS 코드 추천
- **종목 라벨링**  
  - 내수형·수출형·수입형 분류 및 HS 코드 매핑  
  - ChatGPT + 전문가 검수로 신뢰도 강화
- **실시간 무역 통계 수집**  
  - 한국·미국 수출입 통계 데이터 1분 단위 스케줄링(crontab) 
- **성능 최적화 & 테스트**  
  - Slow Query 로그 분석 후 인덱스 추가  
  - DOM 오버헤드 제거 및 로딩 스피너 표시  
  - Mockito 기반 단위 테스트로 핵심 기능 검증

## 🏗️ 아키텍처
- **데이터 수집**  
  - 한국, 미국 정부 무역통계 → 스크립트(crontab) → DB 저장
- **백엔드**  
  - Spring Boot API  
    - 네트워크 그래프 생성 API  
    - 품목 검색·분류 API 
- **프론트엔드**  
  - Vue.js 기반 UI  
    - three.js 3D 지구본  
    - force-graph Canvas  
    - 캔들 차트, 라인 차트 컴포넌트
   
      
- **인프라 & CI/CD**  
  - NHN 클라우드  
  - Jenkins 파이프라인 구축
  - <img width="1206" alt="image" src="https://github.com/user-attachments/assets/3c594799-28e3-4b53-8eaa-661fdd790ed2" />

- **협업 툴**  
  - JIRA 이슈 트래킹 및 타임라인 관리
 

- **ERD**  
  - <img width="1041" alt="image" src="https://github.com/user-attachments/assets/1a516588-9f78-4a7a-8160-f420ea9440fe" />
  


## 💻 설치 및 실행
```bash
# 리포지토리 클론
git clone https://github.com/<username>/StockPort.git
cd StockPort

# 백엔드 실행
cd backend
./gradlew bootRun

# 프론트엔드 실행
cd frontend
npm install
npm run serve
