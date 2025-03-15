// Main controller for the extension
// This file loads platform-specific modules and handles URL monitoring

// 코드 흐름
// 1. 현재 호스트명을 확인합니다.
// 2. 호스트명에 맞는 모듈 이름을 찾습니다.
// 3. 해당 사이트의 활성화 상태를 확인합니다.
// 4. 활성화된 경우에만 모듈을 동적으로 로드합니다.
// 5. 모듈이 로드되면:
//      - 초기 규칙을 적용합니다.
//      - 콘텐츠 변화를 감지하는 옵저버를 설정합니다.
//      - URL 변화를 감지하는 옵저버를 설정합니다.
//      - 초기화 성공 메시지를 콘솔에 출력합니다.
// 6. 모듈 로드에 실패하면 오류를 콘솔에 출력합니다.

// Determine which platform we're on
const hostname = window.location.hostname;

// Map hostnames to their respective modules and storage keys
const platformModules = {
  'musinsa.com': {
    module: 'sites/musinsa',
    storageKey: 'musinsaEnabled'
  },
  'm.a-bly.com': {
    module: 'sites/ably',
    storageKey: 'ablyEnabled'
  },
  // Add more platforms as needed
};

// Find the appropriate module for the current site
let currentPlatform = null;
for (const [domain, config] of Object.entries(platformModules)) {
  if (hostname.includes(domain)) {
    currentPlatform = config;
    break;
  }
}

// If we have a module for this platform, check if it's enabled
if (currentPlatform) {
  // Check if this platform is enabled in settings
  chrome.storage.sync.get([currentPlatform.storageKey], function(result) {
    // Default to enabled if setting doesn't exist
    const isEnabled = result[currentPlatform.storageKey] !== undefined ? 
                      result[currentPlatform.storageKey] : true;
    
    if (isEnabled) {
      // Import the platform-specific module
      import(`./${currentPlatform.module}.js`)
        .then(module => {
          // Store the module for later use
          const platformHandler = module.default;
          
          // Initial application of rules
          platformHandler.applyRules(window.location.href);
          
          // Set up a MutationObserver to handle dynamic content changes
          const contentObserver = new MutationObserver(() => {
            platformHandler.applyRules(window.location.href);
          });
          
          // Start observing the document with the configured parameters
          contentObserver.observe(document, { 
            childList: true, 
            subtree: true 
          });
          
          // Also listen for URL changes (for single-page applications)
          let lastUrl = location.href; 
          const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
              lastUrl = url;
              platformHandler.applyRules(url);
            }
          });
          
          urlObserver.observe(document, {subtree: true, childList: true});
          
          console.log(`Initialized layout enhancer for ${currentPlatform.module}`);
        })
        .catch(error => {
          console.error(`Failed to load module for ${currentPlatform.module}:`, error);
        });
    } else {
      console.log(`Layout enhancer for ${currentPlatform.module} is disabled`);
    }
  });
}