export interface SmsSendOptions {
  to: string;
  message: string;
  senderId?: string;
}

export interface SmsSendResponse {
  success: boolean;
  messageId?: string;
  rawResponse?: any;
  error?: string;
}

export interface ISmsProvider {
  sendSms(options: SmsSendOptions): Promise<SmsSendResponse>;
}
