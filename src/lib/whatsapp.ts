// Demo WhatsApp integration — routes all video/voice consultation requests
// to the on-call doctor "Dr. Teja" via WhatsApp.
export const WHATSAPP_NUMBER = "919491966048"; // +91 9491966048
export const ON_CALL_DOCTOR = "Dr. Teja (On-Call Physician)";

/** Open WhatsApp chat reliably. Falls back to web URL if wa.me is blocked. */
export function openWhatsAppChat(message: string) {
  const text = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
  const win = window.open(waUrl, "_blank", "noopener,noreferrer");
  if (!win) {
    // popup blocked → use direct navigation as fallback
    window.location.href = waUrl;
    return;
  }
  // fallback to web.whatsapp.com if wa.me fails to load within 2s
  setTimeout(() => {
    try {
      if (win && !win.closed && win.location && win.location.href === "about:blank") {
        win.location.href = webUrl;
      }
    } catch { /* cross-origin – ignore */ }
  }, 2000);
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