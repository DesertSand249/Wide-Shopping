document.addEventListener('DOMContentLoaded', function() {
  // 체크박스 요소들 가져오기
  const musinsaCheckbox = document.querySelector('.page:nth-child(1) input[type="checkbox"]');
  const ablyCheckbox = document.querySelector('.page:nth-child(2) input[type="checkbox"]');
  
  // 저장된 설정 불러오기
  chrome.storage.sync.get(['musinsaEnabled', 'ablyEnabled'], function(result) {
    // 저장된 값이 있으면 체크박스에 적용, 없으면 기본값(true) 사용
    musinsaCheckbox.checked = result.musinsaEnabled !== undefined ? result.musinsaEnabled : true;
    ablyCheckbox.checked = result.ablyEnabled !== undefined ? result.ablyEnabled : true;
  });
  
  // 체크박스 변경 이벤트 리스너 추가
  musinsaCheckbox.addEventListener('change', function() {
    // 설정 저장
    chrome.storage.sync.set({musinsaEnabled: this.checked});
  });
  
  ablyCheckbox.addEventListener('change', function() {
    // 설정 저장
    chrome.storage.sync.set({ablyEnabled: this.checked});
  });
});