/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */

/**
 * Sanitizes a person's name for an RSVP-style form.
 * Keeps Unicode letters (including ñ), combining marks, spaces,
 * apostrophes, and hyphens.
 *
 * @param {string} value - The name to sanitize.
 * @returns {string} The sanitized name.
 */
export const sanitizeNameInput = (value: string): string => {
  return String(value ?? "")
    .normalize("NFC") // preserves characters such as ñ
    .replace(/[^\p{L}\p{M}\s'’\-]/gu, "") // remove digits, emojis, symbols, etc.
    .replace(/\s+/g, " ") // collapse repeated whitespace
    .replace(/[-'’]{2,}/g, (match) => match[0]) // prevent repeated punctuation
    .trim()
    .replace(/^[-'’]+|[-'’]+$/g, ""); // no punctuation at either end
};

/**
 * Sanitizes ordinary user-entered plain text.
 * Keeps Unicode letters, numbers, punctuation, symbols, and emoji.
 * Removes HTML-significant characters and unsafe control characters.
 *
 * This is for PLAIN TEXT, not rich HTML.
 *
 * @param {string} value - The text to sanitize.
 * @param {{ maxLength: number }} [options={ maxLength: 1000 }] - Options for sanitization.
 * @returns {string} The sanitized text.
 */
export const sanitizeTextInput = (value: string, { maxLength = 1000 } = {}) => {
  return (
    String(value ?? "")
      .normalize("NFC")
      // Remove ASCII control characters, except tab/newline/carriage return
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      // Remove markup-significant characters so this remains plain text
      .replace(/[<>&]/g, "")
      // Normalize line endings and horizontal whitespace
      .replace(/\r\n?/g, "\n")
      .replace(/[^\S\n]+/g, " ")
      // Avoid excessive blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, maxLength)
  );
};
