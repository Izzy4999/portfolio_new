import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Build WhatsApp link from visitor's phone if provided
    const cleanPhone = phone ? phone.replace(/[\s\-\+\(\)]/g, "") : null;
    const whatsappText = encodeURIComponent(
      `Hi ${name}! I'm Favour. I received your enquiry from my portfolio and would love to connect.`
    );
    const whatsappLink = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${whatsappText}`
      : null;

    // Notification email to Favour
    const notifyResult = await resend.emails.send({
      from: "Portfolio AI <noreply@fiittech.fun>",
      to: "favour.israel.taiwo@outlook.com",
      subject: `New enquiry from ${name} via your portfolio`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #09090b; color: #e4e4e7; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #f4f4f5; margin: 0 0 24px; font-size: 20px;">New message from your portfolio</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px; width: 80px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #f4f4f5; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; font-size: 14px;">
                <a href="mailto:${email}" style="color: #a1a1aa;">${email}</a>
              </td>
            </tr>
            ${
              cleanPhone
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #f4f4f5; font-size: 14px;">+${cleanPhone}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 0; color: #71717a; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #f4f4f5; font-size: 14px; line-height: 1.6;">${message}</td>
            </tr>
          </table>

          <div style="margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap;">
            ${
              whatsappLink
                ? `<a href="${whatsappLink}" style="display: inline-block; padding: 10px 20px; background: #166534; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px;">
                Reply via WhatsApp
              </a>`
                : `<a href="mailto:${email}" style="display: inline-block; padding: 10px 20px; background: #27272a; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">
                Reply via Email
              </a>`
            }
          </div>

          <p style="margin-top: 28px; font-size: 11px; color: #3f3f46;">Sent via the AI chat on fiittech.fun</p>
        </div>
      `,
    });

    if (notifyResult.error) {
      console.error("[contact] Resend notify error:", notifyResult.error);
      return NextResponse.json({ error: notifyResult.error.message }, { status: 500 });
    }

    // Thank-you email to the visitor
    await resend.emails.send({
      from: "Favour Israel <noreply@fiittech.fun>",
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #09090b; color: #e4e4e7; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #f4f4f5; margin: 0 0 16px; font-size: 20px;">Hey ${name}! 👋</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
            Thanks for reaching out! I'll be in touch with you shortly. In the meantime, feel free to connect with me on LinkedIn or check out my work on GitHub.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px;">
            <a href="https://www.linkedin.com/in/favour-taiwo-8b9b5a200" style="display: inline-block; padding: 10px 20px; background: #27272a; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">
              LinkedIn
            </a>
            <a href="https://github.com/Izzy4999" style="display: inline-block; padding: 10px 20px; background: #27272a; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">
              GitHub
            </a>
          </div>

          <p style="color: #52525b; font-size: 13px; margin: 0;">— Favour Israel Taiwo</p>
          <p style="margin-top: 24px; font-size: 11px; color: #3f3f46;">fiittech.fun</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
