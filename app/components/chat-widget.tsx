"use client";
import { useState, useRef, useEffect, FormEvent, ReactNode } from "react";
import { X, Send, CheckCircle } from "lucide-react";

import { CHAT_OPEN_EVENT } from "@/lib/site";
import { useChatPanelAnchor } from "@/app/hooks/use-chat-panel-anchor";
import type { ChatOpenDetail } from "@/types/contact";

import { ChatLauncher } from "./ChatLauncher";
import { ChatBotMascot } from "./ChatBotMascot";

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
        className="underline underline-offset-2 text-madder hover:text-indigo transition-colors"
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
        <CheckCircle size={28} className="text-indigo" />
        <p className="text-sm font-medium text-indigo">Message sent!</p>
        <p className="text-xs text-indigo/75">Check your inbox — Favour will be in touch soon.</p>
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
        className="w-full bg-white text-indigo placeholder:text-indigo/80 text-xs px-3 py-2.5 rounded-sm border border-indigo/30 outline-none focus:border-indigo transition-all"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="w-full bg-white text-indigo placeholder:text-indigo/80 text-xs px-3 py-2.5 rounded-sm border border-indigo/30 outline-none focus:border-indigo transition-all"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp number (optional, with country code)"
        className="w-full bg-white text-indigo placeholder:text-indigo/80 text-xs px-3 py-2.5 rounded-sm border border-indigo/30 outline-none focus:border-indigo transition-all"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Brief description of what you need..."
        required
        rows={3}
        className="w-full bg-white text-indigo placeholder:text-indigo/80 text-xs px-3 py-2.5 rounded-sm border border-indigo/30 outline-none focus:border-indigo transition-all resize-none"
      />
      {error && <p className="text-xs text-madder">{error}</p>}
      <button
        type="submit"
        disabled={sending || !name.trim() || !email.trim() || !message.trim()}
        className="w-full py-2.5 rounded-sm text-xs font-medium text-indigo bg-white hover:bg-indigo/5
          disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-indigo/30"
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
  const { launcherRef, panelRef, panelStyle, updateAnchor } = useChatPanelAnchor(open);

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

  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    const onOpenRequest = (event: Event): void => {
      setOpen(true);
      const question = (event as CustomEvent<ChatOpenDetail>).detail?.question;
      if (question) sendRef.current(question);
    };
    window.addEventListener(CHAT_OPEN_EVENT, onOpenRequest);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpenRequest);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Chat panel */}
      {/* From lg up the panel sits beside the launcher: --chat-x/--chat-y come from
          useChatPanelAnchor and the clamps keep it inside the viewport. */}
      <div
        ref={panelRef}
        style={panelStyle}
        inert={!open}
        className={`fixed bottom-20 left-3 right-3 z-50 [--chat-w:380px] [--chat-h:min(520px,70dvh)] [--chat-edge:0.75rem] h-[var(--chat-h)] flex flex-col rounded-sm overflow-hidden border border-indigo/30 bg-cloud shadow-[0_32px_64px_-24px_rgba(43,47,127,0.6)]
          lg:inset-auto lg:w-[var(--chat-w)] lg:left-[clamp(var(--chat-edge),var(--chat-x,100vw),calc(100vw_-_var(--chat-w)_-_var(--chat-edge)))] lg:top-[clamp(var(--chat-edge),var(--chat-y,100vh),calc(100dvh_-_var(--chat-h)_-_var(--chat-edge)))]
          transition-[opacity,transform] duration-200 ease-out-strong origin-bottom-right lg:origin-[var(--chat-origin,bottom_right)]
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-3 pointer-events-none"}`}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-saffron z-10" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3.5 border-b border-indigo/25 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <ChatBotMascot isHeadOnly className="w-12 h-auto" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 hidden rounded-full border-[2px] border-indigo/30 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo leading-none tracking-tight">
                Favour's AI
              </p>
              <p className="text-[11px] text-indigo/75 mt-1 leading-none">
                Ask me anything
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-indigo/75 hover:text-indigo hover:bg-indigo/5 transition-all"
            aria-label="Close chat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 pt-3">
              <ChatBotMascot className="w-16 h-auto" />
              <div className="text-center space-y-1.5">
                <p className="text-sm font-semibold text-indigo">
                  Hey there!
                </p>
                <p className="text-xs text-indigo/75 max-w-[200px] leading-relaxed mx-auto">
                  I can tell you all about Favour's skills, projects, and how
                  to reach him.
                </p>
              </div>
              <div className="w-full space-y-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left text-xs px-3.5 py-2.5 rounded-sm border border-indigo/30 bg-white text-indigo/75
                      hover:border-indigo hover:text-indigo hover:bg-indigo/5 transition-all duration-150 flex items-center gap-2.5 group"
                  >
                    <span className="text-indigo/75 group-hover:text-indigo transition-colors">›</span>
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
                  <ChatBotMascot isHeadOnly className="flex-shrink-0 w-8 h-auto mt-0.5" />
                  <div className="flex flex-col gap-2 max-w-[78%]">
                    <button
                      onClick={() => send("I'd like to see Favour's contact details")}
                      className="text-left text-xs px-3.5 py-2.5 rounded-sm border border-indigo/30 bg-white text-indigo
                        hover:border-indigo hover:text-indigo hover:bg-indigo/5 transition-all duration-150 flex items-center gap-2 group"
                    >
                      <span className="text-indigo/75 group-hover:text-indigo transition-colors">›</span>
                      Share Favour's contact details
                    </button>
                    <button
                      onClick={() => send("I'd like to leave my details for Favour to reach out")}
                      className="text-left text-xs px-3.5 py-2.5 rounded-sm border border-indigo/30 bg-white text-indigo
                        hover:border-indigo hover:text-indigo hover:bg-indigo/5 transition-all duration-150 flex items-center gap-2 group"
                    >
                      <span className="text-indigo/75 group-hover:text-indigo transition-colors">›</span>
                      Leave my details for Favour
                    </button>
                  </div>
                </div>
              );
            }

            if (m.role === "form") {
              return (
                <div key={i} className="flex justify-start gap-2 items-start">
                  <ChatBotMascot isHeadOnly className="flex-shrink-0 w-8 h-auto mt-0.5" />
                  <div className="flex-1 bg-white border border-indigo/25 rounded-sm p-3.5">
                    <p className="text-xs font-medium text-indigo mb-3">
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
                              "Your message has been sent to Favour! He'll get back to you soon.",
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
                  <ChatBotMascot isHeadOnly className="flex-shrink-0 w-8 h-auto mb-0.5" />
                )}
                <div
                  className={`max-w-[78%] rounded-sm px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-indigo text-white"
                      : "bg-white text-indigo border border-indigo/25"
                  }`}
                >
                  {m.content ? (
                    renderContent(m.content)
                  ) : (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t border-indigo/25 bg-white flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Favour..."
              disabled={loading}
              className="flex-1 bg-white text-indigo placeholder:text-indigo/80 text-sm px-3.5 py-2.5 rounded-sm
                border border-indigo/30 outline-none focus:border-indigo 
                transition-all duration-150 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-indigo
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150
                hover:scale-105 active:scale-95 border border-indigo/30 bg-white hover:bg-indigo/5 hover:border-indigo"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <ChatLauncher
        ref={launcherRef}
        isOpen={open}
        onToggle={() => setOpen((o) => !o)}
        onMoved={updateAnchor}
      />
    </>
  );
}
