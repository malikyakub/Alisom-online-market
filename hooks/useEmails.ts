import { useState } from "react";
import useOrders from "./useOrders";

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`Sending email to ${to} with subject "${subject}"`);
  return true;
}

const useEmails = () => {
  const { getOrder } = useOrders();
  const [isLoading, setIsLoading] = useState(false);

  async function sendOrderApprovalRequest(order_id: string) {
    setIsLoading(true);
    try {
      const { data: order, err } = await getOrder(order_id);
      if (err || !order) throw new Error("Order not found");

      const adminEmail = "mkyareyacquub@gmail.com";
      const adminName = "Store Admin";

      const itemsHtml = order.items
        .map(
          (item: any) =>
            `<li>${item.products?.name || "Product"} x ${item.quantity} @ $${
              item.products?.price
            }</li>`
        )
        .join("");

      const html = `
        <h2>Payment Approval Needed for Order #${order.Order_id}</h2>
        <p>Hello ${adminName},</p>
        <p>Order placed by <strong>${order.Full_name}</strong> (${order.Email}) requires your payment approval.</p>
        <h3>Order Details:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total Price:</strong> $${order.total_price}</p>
        <p>Shipping Address: ${order.Address}, ${order.City}</p>
        <p>Please review and approve the payment.</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;

      await sendEmail({
        to: adminEmail,
        subject: `Payment Approval for Order #${order.Order_id}`,
        html,
      });

      return { success: true, err: null };
    } catch (error) {
      return { success: false, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  function generateOrderStatusUpdate(
    order_id: string,
    from: string,
    to: string,
    status: "Approved" | "Denied" | "Pending"
  ) {
    return {
      subject: `Order #${order_id} Payment Status Update`,
      html: `
        <h2>Order #${order_id} Payment Status Update</h2>
        <p>From: ${from}</p>
        <p>To: ${to}</p>
        <p>The payment for order <strong>#${order_id}</strong> has been <strong>${status}</strong>.</p>
        <p>Thank you for using our service.</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `,
    };
  }

  async function sendOrderStatusEmail(
    order_id: string,
    from: string,
    to: string,
    status: "Approved" | "Denied" | "Pending"
  ) {
    setIsLoading(true);
    try {
      const { subject, html } = generateOrderStatusUpdate(
        order_id,
        from,
        to,
        status
      );
      await sendEmail({ to, subject, html });
      return { success: true, err: null };
    } catch (error) {
      return { success: false, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function sendContactFormEmail(
    name: string,
    email: string,
    message: string
  ) {
    setIsLoading(true);
    try {
      const adminEmail = import.meta.env.VITE_EMAIL_USER || "";
      const subject = `New Contact Form Message from ${name}`;
      const html = `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;
      await sendEmail({ to: adminEmail, subject, html });
      return { success: true, err: null };
    } catch (error) {
      return { success: false, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function sendPasswordResetEmail(email: string, resetLink: string) {
    setIsLoading(true);
    try {
      const subject = "Password Reset Request";
      const html = `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;
      await sendEmail({ to: email, subject, html });
      return { success: true, err: null };
    } catch (error) {
      return { success: false, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function sendNewAccountConfirmationEmail(
    email: string,
    fullname: string
  ) {
    setIsLoading(true);
    try {
      const subject = "Welcome to Our Store!";
      const html = `
        <h2>Account Created Successfully</h2>
        <p>Hello ${fullname},</p>
        <p>Thank you for creating an account with us.</p>
        <p>We’re excited to have you onboard!</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;
      await sendEmail({ to: email, subject, html });
      return { success: true, err: null };
    } catch (error) {
      return { success: false, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    sendOrderApprovalRequest,
    sendOrderStatusEmail,
    sendContactFormEmail,
    sendPasswordResetEmail,
    sendNewAccountConfirmationEmail,
    isLoading,
  };
};

export default useEmails;
