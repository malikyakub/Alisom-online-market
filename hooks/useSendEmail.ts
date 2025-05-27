// hooks/useSendEmail.ts
import { useState } from "react";
import { Resend } from "resend";

const resend = new Resend("re_b69GYR7q_CaHwnuc4E7kReSdNT3VSnE9j");

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

export type EmailMessage = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

const useSendEmail = () => {
  async function sendBatchEmails(
    messages: EmailMessage[]
  ): Promise<ReturnType<any>> {
    try {
      const result = await resend.batch.send(messages);

      if (result.error) {
        throw new Error(result.error.message || "Failed to send emails");
      }

      return { data: result, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  return {
    sendBatchEmails,
  };
};

export default useSendEmail;
