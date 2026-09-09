export const whatsappNumber = '355695535111';
export const whatsappBaseUrl = `https://wa.me/${whatsappNumber}`;

export function whatsappUrl(message?: string): string {
  if (!message) {
    return whatsappBaseUrl;
  }

  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
