<template>
  <div class="header-container">
    <div class="logo-container">
      <router-link to="/" class="logo">STOCKPORT</router-link>
    </div>

    <div class="search-toggle-container">
      <!-- 검색 토글 (종목/품목) -->
      <div class="search-toggle">
        <ToggleSwitch
          v-model="searchType"
          :options="[
            { value: 'stock', label: '종목' },
            { value: 'product', label: '품목' },
          ]"
          @change="handleSearchTypeChange"
        />
      </div>

      <!-- 검색창 -->
      <div class="search-container" ref="searchContainer">
        <input
          type="text"
          v-model="searchInput"
          :placeholder="
            searchType === 'stock' ? '종목을 검색하세요' : '품목을 검색하세요'
          "
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button">
          <img
            src="@/assets/images/SearchButton.svg"
            alt="검색"
            @click="handleSearch"
          />
        </button>
      </div>
    </div>

    <div class="login-container">
      <button class="login-button">여기에 검색창 보이면 됩니다</button>
    </div>

    <!-- 검색 결과 패널 -->
    <div
      v-if="hasSearched && searchResults.length > 0"
      class="search-results-panel"
      ref="resultsPanel"
    >
      <div v-if="searchType === 'stock'" class="stock-results">
        <div
          v-for="(item, index) in searchResults"
          :key="`stock-${index}`"
          class="result-item stock-item"
          @click="goToStockPage(item)"
        >
          <div class="result-info">
            <img
              class="result-logo"
              :src="`https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${item.code}.png`"
              alt="종목 아이콘"
              @error="
                (e) =>
                  (e.target.src =
                    'https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
              "
            />
            <div class="result-details">
              <div class="result-name">{{ item.name }}</div>
              <div class="result-code">{{ item.code }}</div>
            </div>
          </div>
          <div class="result-price">
            {{ item.price }} {{ item.marketType === "NASDAQ" ? "USD" : "원" }}
          </div>
        </div>
      </div>

      <div v-else-if="searchType === 'product'" class="product-results">
        <div
          v-for="(item, index) in searchResults"
          :key="`product-${index}`"
          class="result-item product-item"
          @click="goToProductPage(item)"
        >
          <div class="result-info">
            <div class="result-details">
              <div class="result-name">{{ item.hsName }}</div>
              <div class="result-code">{{ item.hsCode }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleSwitch from "@/components/toggle/ToggleSwitch.vue";
import { getSearchAPI } from "@/apis/stock";
import { getSearchProductAPI } from "@/apis/product";

export default {
  name: "HeaderSearch",
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      searchType: "stock",
      searchInput: "",
      hasSearched: false,
      searchResults: [],
      isLoading: false,
    };
  },
  mounted() {
    document.addEventListener("click", this.onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onClickOutside);
  },
  methods: {
    handleSearchTypeChange(value) {
      this.searchType = value;
      this.searchInput = "";
      this.hasSearched = false;
      this.searchResults = [];
    },

    async handleSearch() {
      if (!this.searchInput.trim()) return;

      this.isLoading = true;
      this.hasSearched = true;

      try {
        if (this.searchType === "stock") {
          const response = await getSearchAPI(this.searchInput);
          if (response && response.status === "OK") {
            this.searchResults = response.data.map((item) => ({
              name: item.companyName,
              code: item.ticker,
              price:
                item.marketType === "NASDAQ"
                  ? parseFloat(item.currentPrice)
                  : parseInt(item.currentPrice, 10),
              changePercent:
                item.marketType === "NASDAQ"
                  ? parseFloat(item.changeRate) / 100
                  : parseFloat(item.changeRate, 10),
              stockId: item.stockId,
              marketType: item.marketType,
            }));
          }
        } else {
          const response = await getSearchProductAPI(this.searchInput);
          if (response && response.status === "OK") {
            this.searchResults = response.data;
          }
        }
      } catch (error) {
        console.error("검색 오류:", error);
        this.searchResults = [];
      } finally {
        this.isLoading = false;
      }
    },

    goToStockPage(item) {
      this.$router.push({ name: "stock", params: { stockId: item.stockId } });
      this.hasSearched = false;
    },

    goToProductPage(item) {
      this.$router.push({
        name: "product",
        params: { productId: item.hsCodeId },
      });
      this.hasSearched = false;
    },

    onClickOutside(event) {
      const searchContainer = this.$refs.searchContainer;
      const resultsPanel = this.$refs.resultsPanel;

      if (
        this.hasSearched &&
        searchContainer &&
        resultsPanel &&
        !searchContainer.contains(event.target) &&
        !resultsPanel.contains(event.target)
      ) {
        this.hasSearched = false;
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.logo-container {
  flex: 1;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #000c37;
  text-decoration: none;
}

.search-toggle-container {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 600px;
}

.search-toggle {
  min-width: 120px;
}

.search-container {
  flex: 1;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 20px rgba(207, 222, 241, 0.5);
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 15px;
}

.search-button {
  width: 50px;
  background-color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button img {
  height: 28px;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.login-button {
  padding: 8px 20px;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-button:hover {
  background-color: #f5f5f5;
}

/* 검색 결과 패널 */
.search-results-panel {
  position: absolute;
  top: 100%;
  left: 20%;
  width: 60%;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(207, 222, 241, 0.8);
  z-index: 1000;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f2f7ff;
}

.result-item:last-child {
  border-bottom: none;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.result-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: contain;
  background-color: #f5f6fa;
}

.result-details {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-weight: 600;
  color: #000c37;
  margin-bottom: 4px;
}

.result-code {
  font-size: 13px;
  color: #888;
}

.result-price {
  font-weight: 600;
  color: #000c37;
}

/* 반응형 */
@media (max-width: 992px) {
  .search-toggle-container {
    flex: 1;
  }

  .login-container {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .logo-container {
    width: 100%;
    text-align: center;
  }

  .search-toggle-container {
    width: 100%;
    max-width: 100%;
  }

  .search-results-panel {
    width: 90%;
    left: 5%;
  }
}
</style>
