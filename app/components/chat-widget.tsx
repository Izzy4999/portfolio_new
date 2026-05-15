"use client";
import { useState, useRef, useEffect, FormEvent, ReactNode } from "react";
import { X, Send, Sparkles, CheckCircle } from "lucide-react";

function renderContent(text: string): ReactNode[] {
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s,]+)|([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const email = match[4];
    const href = email ? `mailto:${email}` : (match[2] ?? match[3]);
    const label = match[1] ?? email ?? match[3];
    nodes.push(
      <a
        key={match.index}
        href={href}
        target={email ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="underline text-zinc-200 hover:text-white transition-colors"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length > 0 ? nodes : [text];
}

type MessageRole = "user" | "assistant" | "form" | "options";

type Message = {
  role: MessageRole;
  content: string;
};

const STARTERS = [
  "What are Favour's main skills?",
  "Tell me about his projects",
  "Is he available for hire?",
];

function ContactForm({ onSent }: { onSent: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone.trim(), message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setTimeout(onSent, 2000);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle size={28} className="text-green-400" />
        <p className="text-sm font-medium text-zinc-200">Message sent!</p>
        <p className="text-xs text-zinc-500">Check your inbox — Favour will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="w-full bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 text-xs px-3 py-2.5 rounded-xl border border-zinc-700/40 outline-none focus:border-zinc-500/60 transition-all"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="w-full bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 text-xs px-3 py-2.5 rounded-xl border border-zinc-700/40 outline-none focus:border-zinc-500/60 transition-all"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp number (optional, with country code)"
        className="w-full bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 text-xs px-3 py-2.5 rounded-xl border border-zinc-700/40 outline-none focus:border-zinc-500/60 transition-all"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Brief description of what you need..."
        required
        rows={3}
        className="w-full bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 text-xs px-3 py-2.5 rounded-xl border border-zinc-700/40 outline-none focus:border-zinc-500/60 transition-all resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={sending || !name.trim() || !email.trim() || !message.trim()}
        className="w-full py-2.5 rounded-xl text-xs font-medium text-zinc-100 bg-zinc-700 hover:bg-zinc-600
          disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-zinc-600/50"
      >
        {sending ? "Sending…" : "Send to Favour"}
      </button>
    </form>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Detect special tokens in completed assistant messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant") return;

    if (last.content.includes("[CONTACT_OPTIONS]")) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: last.content.replace("[CONTACT_OPTIONS]", "").trim(),
        },
        { role: "options", content: "" },
      ]);
    } else if (last.content.includes("[CONTACT_FORM]") && !formSubmitted) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: last.content.replace("[CONTACT_FORM]", "").trim(),
        },
        { role: "form", content: "" },
      ]);
    }
  }, [messages, formSubmitted]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const apiMessages = [...messages.filter((m) => m.role !== "form" && m.role !== "options"), userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: aiText },
        ]);
      }

      // Token detection handled by useEffect
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden
          transition-all duration-300 ease-out origin-bottom-right
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-3 pointer-events-none"}`}
        style={{
          background: "linear-gradient(180deg, #111113 0%, #0c0c0e 100%)",
          boxShadow:
            "0 32px 64px -16px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/40 to-transparent z-10" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-zinc-200 border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
                }}
              >
                FI
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-[2px] border-zinc-950 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100 leading-none tracking-tight">
                Favour's AI
              </p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-none">
                Ask me anything
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all"
            aria-label="Close chat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 pt-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, #3f3f46 0%, #1c1c1f 100%)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <Sparkles size={20} className="text-zinc-300" />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-sm font-semibold text-zinc-200">
                  Hey there! 👋
                </p>
                <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                  I can tell you all about Favour's skills, projects, and how
                  to reach him.
                </p>
              </div>
              <div className="w-full space-y-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-zinc-400
                      hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-150 flex items-center gap-2.5 group"
                  >
                    <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">›</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            if (m.role === "options") {
              return (
                <div key={i} className="flex justify-start gap-2 items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 border border-white/10"
                    style={{ background: "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)" }}
                  >
                    <span className="text-[8px] font-bold text-zinc-300">FI</span>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[78%]">
                    <button
                      onClick={() => send("I'd like to see Favour's contact details")}
                      className="text-left text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-zinc-300
                        hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all duration-150 flex items-center gap-2 group"
                    >
                      <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">›</span>
                      Share Favour's contact details
                    </button>
                    <button
                      onClick={() => send("I'd like to leave my details for Favour to reach out")}
                      className="text-left text-xs px-3.5 py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-zinc-300
                        hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all duration-150 flex items-center gap-2 group"
                    >
                      <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">›</span>
                      Leave my details for Favour
                    </button>
                  </div>
                </div>
              );
            }

            if (m.role === "form") {
              return (
                <div key={i} className="flex justify-start gap-2 items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 border border-white/10"
                    style={{
                      background:
                        "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
                    }}
                  >
                    <span className="text-[8px] font-bold text-zinc-300">FI</span>
                  </div>
                  <div className="flex-1 bg-zinc-900/80 border border-white/[0.06] rounded-2xl rounded-tl-sm p-3.5">
                    <p className="text-xs font-medium text-zinc-300 mb-3">
                      Drop your details below:
                    </p>
                    <ContactForm
                      onSent={() => {
                        setFormSubmitted(true);
                        setMessages((prev) => [
                          ...prev.filter((msg) => msg.role !== "form"),
                          {
                            role: "assistant",
                            content:
                              "Your message has been sent to Favour! He'll get back to you soon. 🎉",
                          },
                        ]);
                      }}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mb-0.5 border border-white/10"
                    style={{
                      background:
                        "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
                    }}
                  >
                    <span className="text-[8px] font-bold text-zinc-300">FI</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-zinc-800 text-zinc-100 rounded-tr-sm border border-zinc-700/40"
                      : "bg-zinc-900/80 text-zinc-300 rounded-tl-sm border border-white/[0.06]"
                  }`}
                >
                  {m.content ? (
                    renderContent(m.content)
                  ) : (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Favour..."
              disabled={loading}
              className="flex-1 bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 text-sm px-3.5 py-2.5 rounded-xl
                border border-zinc-700/40 outline-none focus:border-zinc-500/60 focus:bg-zinc-800/80
                transition-all duration-150 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-300
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150
                hover:scale-105 active:scale-95 border border-zinc-700/60 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-600"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 group"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: "0 0 24px rgba(161,161,170,0.18)" }}
          />
          {open ? (
            <X size={19} className="text-zinc-300 relative z-10" />
          ) : (
            <div className="relative z-10">
              <Sparkles size={21} className="text-zinc-200" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900 shadow-sm" />
            </div>
          )}
        </div>
      </button>
    </>
  );
}
