// Edge function: nhận thông tin từ form liên hệ và gửi email cho admin (kietduong611@gmail.com)
// Đồng thời gửi email xác nhận cho khách. Sử dụng Resend API.

import { Resend } from "npm:resend@4.0.0";
import { z } from "npm:zod@3.23.8";

// Header CORS để cho phép trình duyệt gọi function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email nhận thông báo (admin)
const ADMIN_EMAIL = "kietduong611@gmail.com";

// Schema validate dữ liệu đầu vào — đảm bảo không nhận dữ liệu rác
const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

Deno.serve(async (req) => {
  // Trình duyệt gửi preflight OPTIONS — trả về OK
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Lấy API key của Resend từ secret (đã cấu hình trong Lovable Cloud)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("Thiếu RESEND_API_KEY");
    }

    // Đọc body và validate
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { name, phone, email, message } = parsed.data;
    const resend = new Resend(RESEND_API_KEY);

    // Hàm escape HTML đơn giản — tránh chèn HTML/script độc hại vào email
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // === 1) Email gửi cho ADMIN (bạn) ===
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#b8860b;">📩 Yêu cầu tư vấn mới từ TIKA Network</h2>
        <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding:8px; background:#f9f9f9; font-weight:bold; width:140px;">Họ và tên</td><td style="padding:8px;">${esc(name)}</td></tr>
          <tr><td style="padding:8px; background:#f9f9f9; font-weight:bold;">Số điện thoại</td><td style="padding:8px;">${esc(phone)}</td></tr>
          <tr><td style="padding:8px; background:#f9f9f9; font-weight:bold;">Email</td><td style="padding:8px;">${esc(email)}</td></tr>
          <tr><td style="padding:8px; background:#f9f9f9; font-weight:bold; vertical-align:top;">Nội dung</td><td style="padding:8px; white-space:pre-wrap;">${esc(message)}</td></tr>
        </table>
        <p style="margin-top:24px; color:#666; font-size:12px;">Email tự động từ form liên hệ trên website TIKA Network.</p>
      </div>
    `;

    const adminResult = await resend.emails.send({
      from: "TIKA Network <onboarding@resend.dev>", // Domain test mặc định của Resend
      to: [ADMIN_EMAIL],
      replyTo: email, // Bạn có thể reply trực tiếp về email khách
      subject: `[TIKA] Yêu cầu tư vấn từ ${name}`,
      html: adminHtml,
    });

    if (adminResult.error) {
      console.error("Lỗi gửi email admin:", adminResult.error);
      throw new Error(`Gửi email admin thất bại: ${JSON.stringify(adminResult.error)}`);
    }

    // === 2) Email xác nhận gửi cho KHÁCH HÀNG ===
    // Lưu ý: với domain test "onboarding@resend.dev" của Resend, email khách
    // chỉ gửi được tới địa chỉ đã verify trong tài khoản Resend của bạn.
    // Khi gắn domain riêng vào Resend, mới gửi tự do tới mọi email được.
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#b8860b;">Cảm ơn ${esc(name)}!</h2>
        <p>TIKA Network đã nhận được yêu cầu tư vấn của bạn. Đội ngũ chuyên gia sẽ liên hệ với bạn trong thời gian sớm nhất (trong vòng 24 giờ làm việc).</p>
        <p style="margin-top:16px;"><strong>Thông tin bạn đã gửi:</strong></p>
        <ul>
          <li>Số điện thoại: ${esc(phone)}</li>
          <li>Email: ${esc(email)}</li>
        </ul>
        <p style="margin-top:24px;">Trân trọng,<br/><strong>TIKA Network</strong></p>
      </div>
    `;

    // Không throw nếu gửi email khách thất bại — không ảnh hưởng tới việc admin đã nhận
    try {
      await resend.emails.send({
        from: "TIKA Network <onboarding@resend.dev>",
        to: [email],
        subject: "TIKA Network — Đã nhận yêu cầu tư vấn của bạn",
        html: customerHtml,
      });
    } catch (e) {
      console.warn("Không gửi được email xác nhận cho khách:", e);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Đã gửi yêu cầu thành công" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Lỗi send-contact-email:", error);
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
