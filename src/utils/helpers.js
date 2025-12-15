/**
 * 유틸리티 함수 모음
 */

const Utils = {
  /**
   * HTML 엔티티를 디코딩
   */
  decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  },

  /**
   * 버튼 스타일 적용 헬퍼
   */
  applyButtonStyle(button, styleObj) {
    Object.keys(styleObj).forEach((key) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      button.style(cssKey, styleObj[key]);
    });
  }
};

if (typeof window !== 'undefined') {
  window.Utils = Utils;
}
