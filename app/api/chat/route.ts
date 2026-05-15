import Groq from "groq-sdk";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

async function notifyAIFailure(errorType: string, detail: string) {
  try {
    await resend.emails.send({
      from: "Portfolio Monitor <noreply@fiittech.fun>",
      to: "princeisrael409@gmail.com",
      subject: `⚠️ Portfolio AI Alert: ${errorType}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #09090b; color: #e4e4e7; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #f87171; margin: 0 0 16px; font-size: 18px;">⚠️ AI Chat Alert</h2>
          <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
            Your portfolio's AI chat encountered an issue. Visitors may currently be unable to use the chat.
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px; width: 100px;">Error type</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #f87171; font-size: 13px; font-weight: 600;">${errorType}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px;">Detail</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #f4f4f5; font-size: 13px;">${detail}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #71717a; font-size: 13px;">Time</td>
              <td style="padding: 10px 0; color: #f4f4f5; font-size: 13px;">${new Date().toUTCString()}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://console.groq.com" style="display: inline-block; padding: 10px 20px; background: #27272a; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">
              Groq Console
            </a>
            <a href="https://vercel.com/dashboard" style="display: inline-block; padding: 10px 20px; background: #27272a; color: #f4f4f5; border-radius: 8px; text-decoration: none; font-size: 13px; border: 1px solid #3f3f46;">
              Vercel Logs
            </a>
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #3f3f46;">fiittech.fun — automated alert</p>
        </div>
      `,
    });
  } catch {
    // Silently fail — don't let notification errors break anything
  }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant on Favour Israel Taiwo's portfolio website. Help visitors learn about Favour and his work.

## About Favour
- Full-stack software engineer based in Lagos, Nigeria
- B.Eng. Electrical Engineering graduate
- Passionate about building web and mobile applications
- Available for freelance and full-time opportunities

## Tech Stack
- **Web:** Next.js (preferred), React, Vite, TypeScript, Tailwind CSS, Chakra UI, Framer Motion
- **Mobile:** React Native with Expo, Expo Router, NativeWind
- **State:** Zustand, Redux, React Query
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios (with interceptors, token refresh patterns)
- **Backend:** Node.js, Express.js, Go (Fiber, Gin)
- **Databases/ORM:** Prisma, Mongoose, PostgreSQL, MongoDB
- **Auth:** JWT, role-based access control, biometric login
- **File uploads:** Cloudinary
- **Tools:** Git, Postman, Docker (basics)

## Projects
1. **Vibes Meet** - Social event platform connecting people through shared experiences. Live at vibes-meet.com
2. **Umley** - Tenant management app: rent payments, maintenance requests, document uploads
3. **Resource** - Resource management platform
4. **AISHA Analytics Dashboard** - Real-time analytics platform for monitoring AI assistant engagement, WhatsApp conversations, user feedback, and media interactions
5. **BroadcastHub** - WhatsApp broadcast & call center platform with template builder, campaign management, agent assignment queues, and response analytics
6. **Pulse** - Survey-as-a-service platform for creating, distributing, and analyzing surveys with real-time dashboards
7. **EasyStudy** - Study app for students
8. **EMR** - Electronic Medical Records system
9. **Fintech** - Finance/payments application
10. **GPT3** - AI integration project
11. **Social Media** - Social networking platform
12. **Sproxil** - Product authentication platform
13. **Student App** - Educational mobile application
14. **Teacher Guide** - Educational tool for teachers

## Contact
- **LinkedIn:** https://www.linkedin.com/in/favour-taiwo-8b9b5a200
- **GitHub:** https://github.com/Izzy4999
- **Email:** favour.israel.taiwo@outlook.com
- **Portfolio:** https://portfolio-new-theta-amber.vercel.app

## Response Guidelines
- Be friendly, concise, and professional
- Keep answers to 2–4 sentences unless more detail is clearly needed
- Do not make up information not listed above
- If asked something unrelated to Favour or software development, politely redirect the conversation

## Lead Collection
When a visitor expresses interest in hiring, collaborating with, or contacting Favour, respond with ONE short sentence and include the exact token \`[CONTACT_OPTIONS]\` at the end. Nothing else. Example: "Sure, I can help with that! [CONTACT_OPTIONS]". Do not list options in text — the UI renders them as buttons automatically.

- If the visitor then says they want Favour's contact details, share his email (favour.israel.taiwo@outlook.com) and LinkedIn (https://www.linkedin.com/in/favour-taiwo-8b9b5a200). Keep it to one short sentence.
- If the visitor says they want to leave their details, respond with one short sentence and include the exact token \`[CONTACT_FORM]\`. Example: "Fill in the form below and I'll make sure Favour gets it. [CONTACT_FORM]"
- Only include each token once per conversation. Never explain the tokens.`;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages } = await req.json();

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    const message = (err as { message?: string })?.message ?? "Unknown error";

    if (status === 401) {
      await notifyAIFailure("Invalid API Key", "The Groq API key is invalid or has been revoked. Update it in Vercel environment variables.");
    } else if (status === 429) {
      await notifyAIFailure("Rate Limit / Quota Exceeded", message);
    } else if (status === 503 || status === 500) {
      await notifyAIFailure("Groq Service Unavailable", message);
    } else {
      await notifyAIFailure("Unexpected Error", `Status ${status ?? "unknown"}: ${message}`);
    }

    return new Response(JSON.stringify({ error: "Failed to get a response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
