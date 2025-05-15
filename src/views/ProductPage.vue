<template>
  <DetailLayout
    :relatedNews="relatedNews"
    type="product"
    :relatedStocks="relatedStocks"
  />
</template>

<script>
import DetailLayout from "@/components/detailPage/Layout.vue";
const relatedNews = [
  {
    id: 1,
    tag: "호재",
    tagColor: "#E5484D", // 빨강
    image: "https://via.placeholder.com/300x180?text=뉴스1",
    url: "https://google.com",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미조선 미디어조선 미디선 미디어조선 미디어디어",
    date: "3일 전",
  },
  {
    id: 2,
    tag: "악재",
    tagColor: "#3D8BFF", // 파랑
    image: "https://via.placeholder.com/300x180?text=뉴스2",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    url: "https://google.com",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 3,
    tag: "중립",
    tagColor: "#A5A5A5", // 회색
    image: "https://via.placeholder.com/300x180?text=뉴스3",
    title:
      "신한투자증권, 금자증권, 금융 IT 인재 키운다융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 4,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 5,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 6,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
];

const relatedStocks = {
  kr: [
    {
      stockId: 1648,
      ticker: "318010",
      name: "팜스빌",
      companyOverview:
        "동사는 2000년 건강식품 및 식품의 개발, 제조 유통 및 수출입업을 목적으로 설립되어 바이오헬스케어 선두주자로 성장함. 건강기능식품 제조와 유통을 주력으로 하며, B2C전자상거래 플랫폼 '애플트리 김약사네' 등 12개의 차별화된 브랜드를 통해 사업을 영위하고 있음. 마이크로바이옴 기술개발 도입과 C&BD 전략을 통한 기술력 확보, 220건의 해외특허와 상표 등록을 보유하며 글로벌 기업으로의 도약을 준비하고 있음.",
    },
    {
      stockId: 122,
      ticker: "168330",
      name: "내츄럴엔도텍",
      companyOverview:
        "동사는 2001년 설립되어 2013년 코스닥 시장에 상장하였으며, 물리·화학·생물학 연구개발업을 주요사업으로 함. 천연물 소재 연구개발 기술을 기반으로 천연물 신약, 건강기능식품 신소재, 화장품 연구개발 및 제조·판매를 주력사업으로 영위함. 독자적 기술력으로 고기능성 건강기능식품 소재와 자연주의 화장품을 개발하며, 마이크로니들 기반 미용패치 등 혁신 제품으로 시장 경쟁력 강화.",
    },
    {
      stockId: 122,
      ticker: "168330",
      name: "내츄럴엔도텍",
      companyOverview:
        "동사는 2001년 설립되어 2013년 코스닥 시장에 상장하였으며, 물리·화학·생물학 연구개발업을 주요사업으로 함. 천연물 소재 연구개발 기술을 기반으로 천연물 신약, 건강기능식품 신소재, 화장품 연구개발 및 제조·판매를 주력사업으로 영위함. 독자적 기술력으로 고기능성 건강기능식품 소재와 자연주의 화장품을 개발하며, 마이크로니들 기반 미용패치 등 혁신 제품으로 시장 경쟁력 강화.",
    },
  ],
  us: [
    {
      stockId: 3664,
      ticker: "BYRN",
      name: "버나 테크놀로지스",
      companyOverview:
        "이 회사는 기술 회사다. 이 회사는 살상력이 낮은 첨단 개인 보안 솔루션의 개발, 제조 및 판매를 전문으로 한다. 제품 포트폴리오로는 1) 일반 소비자와 전문 경비 고객이 사용할 수 있도록 설계된 휴대용 개인 보안 장치 및 어깨 발사 발사기, 2) 화학 자극제, 운동성 및 불활성 탄환을 포함한 Byrna 장치에서 발사되는 투사체 라인, 3) Byrna Bad Guy Repellent를 포함한 호신용 에어로졸 제품 라인, 4) Byrna Banshee, Byrna Shield, 압축 CO2 캐니스터, 조준경 시스템, 홀스터 및 Byrna 브랜드 의류 등 액세서리 및 관련 안전 제품군이 있다.  주력 제품인 Byrna SD는 소형 권총의 크기와 폼 팩터를 갖춘 인체공학적으로 설계된 소형 휴대용 개인 호신용 장치다. 사용하기 쉽고 반동이 거의 없으며 50피트의 유효 사거리로 정확하게 발사할 수 있도록 설계되었다.",
    },
    {
      stockId: 3684,
      ticker: "UPXI",
      name: "유펙시",
      companyOverview:
        "이 회사는 건강, 웰니스, 반려동물, 미용 및 기타 성장하는 시장의 브랜드를 보유한 다각화된 브랜드 소유 기업이다. 소비자 직접 판매 및 Amazon 브랜드에 중점을 둔다. 자체 SaaS 프로그래매틱 광고 기술을 활용하여 고객당 비용을 낮추고 소비자 데이터를 축적하여 성장하는 브랜드 포트폴리오 간의 교차 판매를 늘릴 수 있도록 지원한다.  브랜드 제품 부문은 회사가 소유한 브랜드 제품의 개발, 성장 및 유통에 중점을 둔다. 리커머스는 Amazon 및 도매 유통업체와 같은 채널을 통한 신제품 및 중고 제품의 구매 및 판매에 중점을 둔다.  회사의 브랜드에는 VitaMedica, Tytan Tiles 등이 있다. VitaMedica는 임상의가 개발한 건강기능식품과 코스메슈티컬 제품을 제공한다.  VitaMedica는 외과 의사 및 의료 스파를 통한 도매 유통과 이커머스 및 마켓플레이스를 통한 소비자 직접 유통을 통해 제품을 판매한다.",
    },
    {
      stockId: 4132,
      ticker: "FTLF",
      name: "핏라이프 브랜즈",
      companyOverview:
        "이 회사는 건강에 관심이 많은 소비자를 위한 영양 보충제와 웰빙 제품을 개발 및 마케팅하는 기업이다. 약 300개의 다양한 제품을 온라인, 국내외 GNC 프랜차이즈 매장 및 17,000개 이상의 국내 소매점을 통해 판매한다.  1) NDS Nutrition, PMD Sports, SirenLabs, Core Active, Nutrology, Metis Nutrition(이하 NDS 제품), 2) iSatori, BioGenetic Laboratories, Energize(이하 iSatori 제품), 3) Dr. Tobias, All Natural Advice, Maritime Naturals(이하 MRC 제품), MusclePharm을 판매한다.  NDS 브랜드에는 프리미엄 체중 감량, 스포츠 영양 및 일반 건강 제품이 포함된다. PMD 브랜드에는 프리미엄 스포츠 영양 제품이 포함된다. Nutrology 브랜드에는 천연, 비건, 유기농 성분에 중점을 둔 스포츠 영양 및 일반 웰니스 제품이 포함된다.  SirenLabs 브랜드에는 체중 감량 및 스포츠 영양 제품이 포함된다.",
    },
  ],
};

export default {
  name: "ProductPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      relatedNews,
      relatedStocks,
    };
  },
};
</script>
