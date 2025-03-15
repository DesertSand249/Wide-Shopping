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
  }
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