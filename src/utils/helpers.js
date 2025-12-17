/**
 * Utility functions
 */

const Utils = {
  /**
   * HTML entities decoder
   */
  decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  },

  /**
   * Button style apply
   */
  applyButtonStyle(button, styleObj) {
    Object.keys(styleObj).forEach((key) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      button.style(cssKey, styleObj[key]);
    });
  },
};

if (typeof window !== "undefined") {
  window.Utils = Utils;
}
