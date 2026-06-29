// Demo WhatsApp integration — routes all video/voice consultation requests
// to the on-call doctor "Dr. Teja" via WhatsApp.
export const WHATSAPP_NUMBER = "919491966048"; // +91 9491966048
export const ON_CALL_DOCTOR = "Dr. Teja (On-Call Physician)";

/**
 * Open a WhatsApp chat. We avoid wa.me / api.whatsapp.com (often blocked
 * by ISPs or corporate DNS — that's why some users see "api.whatsapp.com
 * is blocked"). Instead we use the native `whatsapp://` deep-link on
 * mobile and `web.whatsapp.com/send` directly on desktop.
 */
export function openWhatsAppChat(message: string) {
  const text = encodeURIComponent(message);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deepLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;

  if (isMobile) {
    // Try app first, then fall back to web after a short delay.
    window.location.href = deepLink;
    setTimeout(() => {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 1200);
    return;
  }

  // Desktop: open web.whatsapp.com directly (no api.whatsapp.com redirect).
  const win = window.open(webUrl, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = webUrl;
}

export function openWhatsAppVideoCall(context: string) {
  return openWhatsAppChat(
    `📹 NeXora Video Consultation Request\n\nTo: ${ON_CALL_DOCTOR}\n\n${context}\n\nPlease initiate a WhatsApp video call when ready so the patient/attender can receive primary care guidance. Thank you!`,
  );
}

/** Open a regular phone call (uses tel: protocol). */
export function callDoctor() {
  window.location.href = `tel:+${WHATSAPP_NUMBER}`;
}