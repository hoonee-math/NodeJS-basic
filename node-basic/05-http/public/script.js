// script.js

// DOM 로드 완료 시
document.addEventListener('DOMContentLoaded', () => {
  const jsTest = document.getElementById('js-test');
  jsTest.textContent = '✅ JavaScript 로드됨';
  jsTest.classList.add('loaded');

  console.log('✅ 정적 파일 서버에서 JavaScript 실행 중');
});

// 버튼 클릭 핸들러
function handleClick() {
  alert('버튼이 클릭되었습니다!\n\n정적 파일 서버가 정상 작동 중입니다.');
  console.log('버튼 클릭:', new Date().toLocaleTimeString());
}

// 현재 시간 표시 (예제)
console.log('현재 시각:', new Date().toLocaleString());
