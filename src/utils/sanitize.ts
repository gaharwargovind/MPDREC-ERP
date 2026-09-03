import DOMPurify from 'dompurify';

/**
 * Enterprise XSS Sanitization Layer
 * Sanitizes user-generated text, rich announcements, forum posts, and notices
 * before inserting into DOM, mitigating stored and reflected Cross-Site Scripting.
 */

// Allow only safe markup tags and safe attributes
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 
    'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'span'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'svg'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
};

/**
 * Sanitizes raw HTML strings
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
  if (typeof window === 'undefined') {
    // In SSR or non-browser environments, strip script tags defensively
    return dirtyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return String(DOMPurify.sanitize(dirtyHtml, SANITIZE_CONFIG));
}

/**
 * Sanitizes plaintext to prevent HTML injection
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
