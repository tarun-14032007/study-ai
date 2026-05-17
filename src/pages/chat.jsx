import { useState, useEffect, useRef } from 'react'
import { storage } from '../utils/storage.js'
import PageContainer from '../components/ui/PageContainer.jsx'

// ─── Prompt suggestions shown when history is empty ──────────────────────────
const SUGGESTIONS = [
  "Explain Newton's laws of motion in simple terms",
  "What's the difference between mitosis and meiosis?",
  "Give me a 5-step study plan for an exam next week",
  "Explain the Pythagorean theorem with an example",
  "What caused the First World War?",
  "How do I solve quadratic equations?",
]

// ─── Fake AI responses — deterministic to avoid randomness ───────────────────
function generateReply(userMessage) {
  const msg = userMessage.toLowerCase()

  if (msg.includes('newton') || msg.includes('laws of motion')) {
    return "Newton's three laws of motion are:\n\n**1st Law (Inertia):** An object stays at rest or in uniform motion unless acted on by an external force.\n\n**2nd Law:** Force = Mass × Acceleration. The harder you push something, the faster it accelerates.\n\n**3rd Law:** For every action there is an equal and opposite reaction.\n\nThink of it this way — when you push a wall, the wall pushes back on you with the same force. That's the third law in action."
  }

  if (msg.includes('mitosis') || msg.includes('meiosis')) {
    return "Great biology question!\n\n**Mitosis** produces 2 identical daughter cells with the same number of chromosomes as the parent. It's used for growth and repair.\n\n**Meiosis** produces 4 genetically unique cells with half the chromosomes. It's used to create sex cells (sperm and eggs).\n\nSimple memory trick: *Mitosis = Multiplying (same)*. *Meiosis = Making gametes (half)*."
  }

  if (msg.includes('quadratic') || msg.includes('equation')) {
    return "Quadratic equations have the form **ax² + bx + c = 0**.\n\nTo solve, use the quadratic formula:\n\n  x = (−b ± √(b² − 4ac)) / 2a\n\n**Example:** x² − 5x + 6 = 0\n  a=1, b=−5, c=6\n  x = (5 ± √(25 − 24)) / 2\n  x = (5 ± 1) / 2\n  x = 3 or x = 2\n\nYou can also try factoring first — it's faster when it works!"
  }

  if (msg.includes('study plan') || msg.includes('exam')) {
    return "Here's a solid 5-step study plan for an upcoming exam:\n\n**1. Audit your syllabus** — List every topic and mark which ones you're weak on.\n\n**2. Create a schedule** — Divide the days you have left between all topics. Weak topics get more time.\n\n**3. Active recall** — Don't just re-read. Close the book and test yourself. Use the Planner to track this.\n\n**4. Spaced repetition** — Revisit older topics every 2–3 days so you don't forget them.\n\n**5. Mock tests** — Do at least one full past paper under timed conditions before the real exam.\n\nWant me to help you build a schedule for a specific subject?"
  }

  if (msg.includes('pythagorean') || msg.includes('pythagoras')) {
    return "The Pythagorean Theorem states:\n\n  **a² + b² = c²**\n\nwhere **c** is the hypotenuse (longest side) of a right-angled triangle.\n\n**Example:** A triangle has legs of 3 and 4. Find the hypotenuse.\n  3² + 4² = c²\n  9 + 16 = 25\n  c = √25 = **5**\n\nThis is the classic 3-4-5 right triangle. It appears everywhere — construction, navigation, physics!"
  }

  if (msg.includes('world war') || msg.includes('ww1') || msg.includes('first world war')) {
    return "The First World War (1914–1918) was caused by a combination of factors, often remembered as **MAIN**:\n\n**M — Militarism:** European powers were in an arms race, building up their armies and navies.\n\n**A — Alliances:** Europe was split into two armed camps — the Triple Entente and the Triple Alliance.\n\n**I — Imperialism:** Competition for colonies created tensions between the great powers.\n\n**N — Nationalism:** Especially in the Balkans. The assassination of Archduke Franz Ferdinand in Sarajevo was the spark that ignited the war.\n\nThe war killed over 17 million people and reshaped the world map entirely."
  }

  // Generic fallback
  return `That's a good question about "${userMessage}".\n\nIn a production version of Study AI, this response would come from a real AI model connected via API (like GPT-4 or Claude). For now, this is a placeholder to show you how the chat works.\n\nTip: Try asking one of the suggested questions — those have detailed answers built in! You can also connect an AI API key in the settings to get real answers for anything you ask.`
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '12px 14px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: 'var(--text-3)',
            display: 'inline-block',
            animation: `bounce 1.2s ease infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

// ─── Single message bubble ───────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10,
      alignItems: 'flex-end',
      animation: 'slideUp 0.2s ease',
    }}>
      {/* Avatar */}
      <div style={{
        width: 30, height: 30,
        borderRadius: '50%',
        background: isUser ? 'var(--accent)' : 'var(--surface-3)',
        border: `1.5px solid ${isUser ? 'var(--accent)' : 'var(--border-md)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', fontWeight: 700,
        color: isUser ? '#fff' : 'var(--text-2)',
        flexShrink: 0,
      }}>
        {isUser ? 'U' : 'AI'}
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 3, maxWidth: '75%',
      }}>
        <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
          {/* Render message with basic formatting */}
          {msg.text.split('\n').map((line, i) => (
            <p key={i} style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {line.replace(/\*\*(.+?)\*\*/g, '__BOLD__$1__BOLD__').split('__BOLD__').map((chunk, j) =>
                j % 2 === 1 ? <strong key={j}>{chunk}</strong> : chunk
              )}
            </p>
          ))}
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', padding: '0 4px' }}>
          {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ─── Main Chat Page ──────────────────────────────────────────────────────────
export default function Chat({ user }) {
  const [messages, setMessages] = useState(() => storage.get('messages') || [])
  const [input,    setInput]    = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef  = useRef(null)
  const textareaRef = useRef(null)

  // Persist messages
  useEffect(() => {
    storage.set('messages', messages)
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function send(text) {
    const q = (text || input).trim()
    if (!q || thinking) return

    const userMsg = { id: Date.now(), role: 'user', text: q, ts: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Simulate AI delay (500ms–1.5s)
    const delay = 600 + Math.floor(Math.random() * 900)
    setTimeout(() => {
      const aiText = generateReply(q)
      const aiMsg  = { id: Date.now() + 1, role: 'ai', text: aiText, ts: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
      setThinking(false)
    }, delay)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clearChat() {
    if (!window.confirm('Clear all chat history?')) return
    setMessages([])
    storage.remove('messages')
  }

  const userMsgCount = messages.filter(m => m.role === 'user').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--nav-h) - 64px)', minHeight: 400 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexShrink: 0,
      }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            AI Chat
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: 3 }}>
            {userMsgCount === 0 ? 'Ask anything about your studies' : `${userMsgCount} message${userMsgCount !== 1 ? 's' : ''} sent`}
          </p>
        </div>
        {messages.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearChat} style={{ color: 'var(--text-3)' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
            Clear chat
          </button>
        )}
      </div>

      {/* Message list */}
      <div
        className="card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 12,
        }}
      >
        {messages.length === 0 && !thinking ? (
          /* Empty / suggestions state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20, textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60,
              background: 'var(--accent-soft)',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text)', marginBottom: 6 }}>
                Hi {user?.name?.split(' ')[0] || 'there'} 👋 What are you studying?
              </p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
                Ask a question or pick a suggestion below.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8, width: '100%', maxWidth: 560 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={thinking}
                  className="card"
                  style={{
                    padding: '11px 14px',
                    cursor: 'pointer', border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    fontSize: '0.8125rem', color: 'var(--text-2)', textAlign: 'left',
                    lineHeight: 1.4, borderRadius: 'var(--radius)',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <Message key={msg.id} msg={msg} />
            ))}
            {thinking && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--surface-3)', border: '1.5px solid var(--border-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-2)', flexShrink: 0,
                }}>
                  AI
                </div>
                <div className="bubble-ai" style={{ padding: 0 }}>
                  <TypingDots />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="card" style={{ padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a question… (Enter to send · Shift+Enter for new line)"
            disabled={thinking}
            className="input"
            style={{
              flex: 1,
              resize: 'none',
              minHeight: 44,
              maxHeight: 160,
              lineHeight: 1.5,
              border: 'none',
              background: 'transparent',
              boxShadow: 'none',
              padding: '10px 4px',
              fontSize: '0.9375rem',
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className="btn btn-primary btn-icon"
            aria-label="Send message"
            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 11 }}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 6, paddingLeft: 4 }}>
          Responses are simulated. Connect an AI API to get real answers.
        </p>
      </div>
    </div>
  )
}