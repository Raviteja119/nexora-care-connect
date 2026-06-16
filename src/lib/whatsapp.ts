// Demo WhatsApp integration. Update WHATSAPP_NUMBER to redirect demo calls.
export const WHATSAPP_NUMBER = "919491966048"; // +91 9491966048

export function openWhatsAppChat(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openWhatsAppVideoCall(context: string) {
  return openWhatsAppChat(
    `📹 NeXora Video Consultation Request\n\n${context}\n\nPlease initiate a WhatsApp video call when you are ready. Thank you!`,
  );
}