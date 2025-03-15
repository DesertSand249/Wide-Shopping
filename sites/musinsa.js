// Musinsa-specific layout enhancement module
// Define rules for different URL patterns
const rules = [
  {
    pattern: '/musinsa/recommend',
    action: (url) => {
      enhanceLayout()
    }
  },
  {
    pattern: '/musinsa/brand',
    action: (url) => {
      enhanceLayout()
    }
  },
  {
    pattern: '/brand/',
    action: (url) => {
      enhanceLayout()
    }
  },
  {
    pattern: '/musinsa/sale',
    action: (url) => {
      setFullWidth();
      modifyGridTemplateColumns();
      mergeDynamicDivs();
    }
  },
  {
    pattern: '/musinsa/ranking',
    action: (url) => {
      enhanceLayout()
    }
  },
  {
    pattern: '/musinsa/release',
    action: (url) => {
      enhanceLayout()
    }
  },
];

// 공통 레이아웃 개선 함수
function enhanceLayout() {
  mergeDivs();
  setFullWidth();
  modifyGridTemplateColumns();
}

// Function to merge all divs with class "sc-2efdd3c6-3" into the first one
function mergeDivs() {
  // 모든 대상 div를 가져옴
  const divs = document.querySelectorAll(".sc-1y072n9-0.jdzDMq");

  if (divs.length > 1) {
    console.log(`Ably Layout Enhancer: Merging ${divs.length} divs into one`);
    const firstDiv = divs[0]; // 첫 번째 div
    const fragment = document.createDocumentFragment(); // 성능 향상을 위한 DocumentFragment 사용
    
    for (let i = 1; i < divs.length; i++) {
      while (divs[i].firstChild) {
        fragment.appendChild(divs[i].firstChild); // 요소를 fragment에 이동
      }
      divs[i].remove(); // 빈 div 삭제
    }
    
    firstDiv.appendChild(fragment); // 한 번에 DOM에 추가
    console.log('Div merging completed');
  }
}

function mergeDynamicDivs() {
  // 모든 대상 div를 가져옴
  const divs = document.querySelectorAll(".sc-1y072n9-0.jdzDMq");

  if (divs.length > 1) {
    console.log(`Ably Layout Enhancer: Merging ${divs.length} divs into one`);
    const firstDiv = divs[0]; // 첫 번째 div
    const fragment = document.createDocumentFragment(); // 성능 향상을 위한 DocumentFragment 사용
    
    for (let i = 1; i < divs.length; i++) {
      const img = divs[i].querySelector("img") // 첫번째 Img만 검증
      if (img.hasAttribute("src")) {
        while (divs[i].firstChild) {
          fragment.appendChild(divs[i].firstChild); // 요소를 fragment에 이동
        }
        divs[i].remove(); // 빈 div 삭제
      }
    }
    
    firstDiv.appendChild(fragment); // 한 번에 DOM에 추가
    console.log('Div dynamic merging completed');
  }
}

// Function to set full width layout
function setFullWidth() {
  const commonLayoutEl = document.getElementById('commonLayoutContainer');
  if (commonLayoutEl && commonLayoutEl.style.maxWidth !== 'none') {
    commonLayoutEl.style.maxWidth = 'none';
    console.log('Musinsa Layout Enhancer: Set max-width to none');

    // 기존 스타일 제거 (중복 방지)
    const existingStyle = document.getElementById('customStyle');
    if (existingStyle) {
      existingStyle.remove();
    }

    // 새로운 스타일 추가
    const style = document.createElement('style');
    style.id = 'customStyle';
    style.innerHTML = `
      @media (min-width: 600px) {
        #commonLayoutContainer::before, 
        #commonLayoutContainer::after {
          display: none !important;
          content: "" !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  //공통헤더 너비 제한 제거
  const commonHeaderEl = document.getElementById('commonLayoutHeader');
  if (commonHeaderEl && commonHeaderEl.style.maxWidth !== 'none') {
    commonHeaderEl.style.maxWidth = 'none';
  };

 // Swiper 슬라이드 요소 크기 조정
 const commonSwiper = document.getElementsByClassName('swiper-slide');
 if (commonSwiper.length > 0) {
   Array.from(commonSwiper).forEach((el) => {
     el.style.width = '300px';
   });
   console.log('Musinsa Layout Enhancer: Swiper slide width set to 300px');
 }

  // QR 팝업 제거 함수
  function removeQRPopup() {
    const qrPopup = document.querySelector('aside[data-popup-title="앱설치유도QR"]');
    if (qrPopup) {
      qrPopup.remove();
      console.log('Musinsa Layout Enhancer: QR popup removed');
    }
  }
  removeQRPopup();

  // QR 팝업이 동적으로 생성될 경우 감지 후 자동 삭제
  const qrObserver = new MutationObserver(() => {
    removeQRPopup();
  });

  /// 특정 동적 요소들의 max-width 제거 함수
  function removeMaxWidthElements() {
    const dimElements = document.getElementsByClassName('_dim_12777_50');
    const searchHomeWraps = document.getElementsByClassName('search-home-main-wrap');

    if (dimElements.length > 0) {
      Array.from(dimElements).forEach((el) => {
        el.style.maxWidth = 'none';
      });
      console.log('Musinsa Layout Enhancer: _dim_12777_50 max-width set to none');
    }

    if (searchHomeWraps.length > 0) {
      Array.from(searchHomeWraps).forEach((el) => {
        el.style.maxWidth = 'none';
      });
      console.log('Musinsa Layout Enhancer: search-home-main-wrap max-width set to none');
    }
  }
    // 초기 실행 (페이지 로드 시 바로 적용)
    removeMaxWidthElements();

    // main에서 좌측상단 로고 클릭 시 나타나는 DIM 및 search-home-main-wrap 감지 (MutationObserver)
    const observer = new MutationObserver(() => {
      removeMaxWidthElements();
    });
    
  // body의 변화 감지 (DOM 변경 시 트리거)
  observer.observe(document.body, { childList: true, subtree: true });
}

function modifyGridTemplateColumns() {
  // 아이템의 적절한 너비 설정 (픽셀 단위)
  const optimalItemWidth = 200; // 각 아이템의 이상적인 너비 (픽셀)
  
  // 윈도우 너비에 따라 적절한 그리드 열 수 계산
  function calculateGridColumns() {
    const windowWidth = window.innerWidth;
    // 컨테이너 너비 (일반적으로 페이지에 여백이 있을 수 있음)
    const containerWidth = windowWidth * 0.95; // 윈도우 너비의 95%로 가정
    
    // 최적 열 수 계산 (컨테이너 너비 / 아이템 너비)
    let columns = Math.floor(containerWidth / optimalItemWidth);
    
    // 최소 1열, 최대 8열로 제한
    columns = Math.max(1, Math.min(8, columns));
    
    return `repeat(${columns}, 1fr)`;
  }

  // 현재 윈도우 크기에 맞는 그리드 값 적용
  const newValue = calculateGridColumns();
  
  // 스타일시트 수정 시도 - 한 번만 시도하고 실패하면 다른 방법 사용
  let stylesheetModified = false;
  
  // 1. Scan all stylesheet rules - 최적화: 수정 가능한 스타일시트만 처리
  for (let i = 0; i < document.styleSheets.length && !stylesheetModified; i++) {
    try {
      const styleSheet = document.styleSheets[i];
      
      // Skip if stylesheet is from a different origin (CORS restriction)
      if (!styleSheet.cssRules) continue;
      
      // Iterate through all CSS rules in the stylesheet
      for (let j = 0; j < styleSheet.cssRules.length; j++) {
        const rule = styleSheet.cssRules[j];
        
        // Check if it's a style rule (CSSStyleRule)
        if (rule.type === 1) {
          // Check if the rule has grid-template-columns property
          if (rule.style && rule.style.gridTemplateColumns) {
            try {
              // Modify the rule
              rule.style.gridTemplateColumns = newValue;
              console.log(`Modified grid-template-columns in "${rule.selectorText}" to: ${newValue}`);
              stylesheetModified = true;
            } catch (e) {
              console.error('Error modifying rule:', e);
            }
          }
        }
      }
    } catch (e) {
      // This can happen with cross-origin stylesheets
      // 오류 로깅 최소화
    }
  }
  
  // 스타일시트 수정에 실패한 경우에만 직접 요소에 스타일 적용
  if (!stylesheetModified) {
    // 2. Apply the change directly to matching elements using inline styles
    const gridElements = document.querySelectorAll('[style*="grid-template-columns"]');
    gridElements.forEach(element => {
      element.style.gridTemplateColumns = newValue;
    });
    
    // 3. Look for specific class mentioned in the example
    const specificElements = document.querySelectorAll('.IEZkl');
    specificElements.forEach(element => {
      element.style.gridTemplateColumns = newValue;
    });
    
    console.log('Applied grid template columns via inline styles');
  }
}

// Function to add hover effect to images
function addImageHoverEffect() {
  // 스타일 요소 생성
  const styleEl = document.createElement('style');
  styleEl.id = 'ably-image-hover-styles';
  
  // 호버 효과를 위한 CSS 정의
  // 이미지에 transition 효과를 추가하고 호버 시 약간 확대
  styleEl.textContent = `
    img {
      transition: transform 0.3s ease;
    }
    img:hover {
      transform: scale(1.1);
      z-index: 1;
    }
  `;
  
  // 이미 존재하는 스타일이 있는지 확인하고 없으면 추가
  if (!document.getElementById('ably-image-hover-styles')) {
    document.head.appendChild(styleEl);
    console.log('Ably Layout Enhancer: Added image hover effects');
  }
}

// 디바운스 함수 구현
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 디바운스된 그리드 조정 함수
const debouncedModifyGrid = debounce(modifyGridTemplateColumns, 200);

// 윈도우 크기가 변경될 때마다 그리드 조정 (디바운스 적용)
window.addEventListener('resize', debouncedModifyGrid);

// 페이지 로드 시 초기 적용 - DOMContentLoaded가 load보다 빠름
window.addEventListener('DOMContentLoaded', modifyGridTemplateColumns);

// 스크롤 이벤트시 적용 ..
window.addEventListener('scroll', mergeDynamicDivs);

// Main function to apply rules based on URL
function applyRules(url) {
  for (const rule of rules) {
    if (url.includes(rule.pattern)) {
      rule.action(url);
    }
  }
}

// Export the module interface
export default {
  applyRules
}; 