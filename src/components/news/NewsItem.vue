
<template>
  <div class="news-item" @click="clickNews">
    <img :src="imageSrc" alt="뉴스 이미지" />

    <div class="badge" v-if="isBadge" :class="badgeColor">
      <span>{{ news.tag }}</span>
    </div>
    <span class="news-item-title">{{ news.title }}</span>
    <div class="news-item-writer">
      <span class="publisher">{{ news.publisher }}</span>
      <span>•</span>
      <span> {{ news.date }}</span>
    </div>
  </div>
</template>

<script>
import defaultNewsImage from "@/assets/images/defaultNews.svg";

export default {
  name: "NewsItem",
  props: {
    news: {
      type: Object,
      required: true,
    },
    isBadge: {
      type: Boolean,
    },
  },
  data() {
    return {
      hasImageError: false,
    };
  },
  computed: {
    imageSrc() {
      return (this.news.image && this.news.image.trim() !== "") ? this.news.image : defaultNewsImage;
    },

    badgeColor() {
      switch (this.news.tag) {
        case "호재":
          return "badge-positive";
        case "악재":
          return "badge-negative";
        case "중립":
          return "badge-neutral";
        default:
          return "";
      }
    },
  },
  methods: {
    clickNews() {
      window.open(this.news.url, "_blank");
    },
    onImageError() {
      this.hasImageError = true;
    },
  },
};
</script>

<style scoped>
.news-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 6px;
  cursor: pointer;

  /* ✅ 아래 속성 추가 */
  object-fit: contain;
  border-radius: 8px;
}

.news-item .badge {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 4px 10px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: fit-content;
}

.badge-positive {
  background-color: #e5484d;
}
.badge-negative {
  background-color: #3182f6;
}
.badge-neutral {
  background-color: #9f9f9f;
}

.news-item img {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;     /* ✅ 이미지 비율 유지하며 꽉 채우기 */
  display: block; 
}

.news-item-title {
  color: #000;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.news-item-writer {
  display: flex;
  align-items: center;
  color: #6b7684;
  font-size: 10px;
  gap: 2px;
  white-space: nowrap;
  overflow: hidden;
}

.publisher {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
