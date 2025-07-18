import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosError } from "axios";
import { SMSSendResponse } from "../types/sms.response";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  private readonly TOKEN = process.env.SMS_TOKEN;
  private readonly $from = process.env.SMS_FROM;
  private readonly URL = process.env.SMS_URL;
  private readonly USERNAME = process.env.SMS_LOGIN;
  private readonly CALLBACK_URL = process.env.SMS_CALLBACK_URL;

  private $axios = axios.create({
    baseURL: this.URL,
    timeout: 5000, 
  });

  public async sendSMS(message: string, to: string): Promise<boolean> {
    try {
      const authResp = await this.$axios.post<{ data: { token: string } }>(
        '/auth/login',
        {
          email:    this.USERNAME,
          password: this.TOKEN,
        }
      );

      const token = authResp.data.data.token;

      await this.$axios.post<SMSSendResponse>(
        '/message/sms/send',
        {
          from:         this.$from,
          message: 'This is test from Eskiz',
          mobile_phone: to.replace(/\s+/g, ''), 
          callback_url: this.CALLBACK_URL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
            const axiosErr  = err as AxiosError;
            const status    = axiosErr.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            const data      = axiosErr.response?.data;
            // log the full payload the API returned
            this.logger.error('SMS send failed response body:', data);
            throw new HttpException(`SMS Service: ${message}`, status);
    }

      this.logger.error('SMS Service unknown error', err);
      throw new HttpException(
        `SMS Service: ${err.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
