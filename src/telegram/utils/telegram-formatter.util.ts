export class TelegramFormatter {
  /**
   * Escape special characters for MarkdownV2 mode
   */
  static escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
  }

  /**
   * Format alert/notification as structured HTML
   */
  static formatAlert(title: string, details: Record<string, string>): string {
    let message = `<b>🚨 ${title}</b>\n\n`;
    for (const [key, value] of Object.entries(details)) {
      message += `<b>${key}:</b> ${this.escapeHtml(value)}\n`;
    }
    message += `\n<i>Timestamp: ${new Date().toISOString()}</i>`;
    return message;
  }

  static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
