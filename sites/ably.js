const rules = [
  {
    pattern: /^\/$/,  // 정확히 홈페이지만 매칭
    action: (url) => {
      enhanceLayout();
    }
  },
  {
    pattern: /^\/screens(\/.*)?$/,  // /screens 또는 /screens/로 시작하는 모든 경로
    action: (url) => {
      enhanceLayout();
    }
  },
  {
    pattern: /^\/search(\/.*)?$/,  // /search 또는 /search/로 시작하는 모든 경로
    action: (url) => {
      enhanceLayout();
    }
  },
  {
    pattern: /^\/today(\/.*)?$/,  // /today 또는 /today/로 시작하는 모든 경로
    action: (url) => {
      enhanceLayout();
    }
  },
  {
    pattern: /^\/goods(\/.*)?$/,  // /today 또는 /today/로 시작하는 모든 경로
    action: (url) => {
      enhanceLayout();
    }
  }
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
  const divs = document.querySelectorAll(".sc-2efdd3c6-3");

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

function setFullWidth() {
    const bodyEl = document.querySelector('body');
    if (bodyEl && bodyEl.style.maxWidth !== 'none') {
      bodyEl.style.maxWidth = 'none';
      console.log('Ably Layout Enhancer: Set max-width to none on body');
    }

    //앱설치 배너 삭제
    const elementsToRemove = document.querySelectorAll('.gyhUSe');
    if (elementsToRemove.length > 0) {
      elementsToRemove.forEach(el => el.remove());
      console.log('Musinsa Layout Enhancer: Removed elements with class "gyhUSe"');
    }
    
    //앱설치 배너를 삭제함으로써 top에 sticky로 붙는 다른 메뉴바 수치 조정
    const wwefnElements = document.querySelectorAll('.wwefn');
    if (wwefnElements.length > 0) {
      wwefnElements.forEach(el => {
        el.style.top = '48px';
      });
    }

    //최상단 indicator 너비 제한 제거
    const epKAzRElements = document.querySelectorAll('.epKAzR');
    if (epKAzRElements.length > 0) {
      epKAzRElements.forEach(el => {
        el.style.maxWidth = 'none';
      });
    }

    // Swiper 슬라이드 요소 크기 조정
    const commonSwiper = document.getElementsByClassName('swiper-slide');
    if (commonSwiper.length > 0) {
      Array.from(commonSwiper).forEach((el) => {
        el.style.height = '240px';
      });
      console.log('Musinsa Layout Enhancer: Swiper slide width set to 300px');
    };
    // Swiper 슬라이드 내부의 이미지 크기 조정 ('.swiper-slide' 내부의 '.hLLPut' 이미지만 선택)
    const commonSwiperImg = document.querySelectorAll('.swiper-slide .hLLPut');
    if (commonSwiperImg.length > 0) {
      commonSwiperImg.forEach((el) => {
        el.style.height = '240px';
        el.style.width = 'auto';
        el.style.margin = '0 auto';
      });
      console.log('Musinsa Layout Enhancer: Swiper slide images adjusted');
    }
}

// Function to modify grid-template-columns in all stylesheets
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

// Main function to apply rules based on URL
function applyRules(url) {
  // URL에서 경로 부분만 추출
  const path = new URL(url, window.location.origin).pathname;
  
  for (const rule of rules) {
    if (rule.pattern.test(path)) {
      rule.action(url);
      break; // 첫 번째 일치하는 규칙만 적용
    }
  }
}

// Export the module interface
export default {
  applyRules
}; 