import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  response_id?: string;
  question?: string;          // the question this answer responded to (for feedback)
  feedback?: 'up' | 'down' | 'submitted';
}

interface Source {
  title: string;
  url: string;
  product: string;
}

function formatMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');
}

/**
 * Compact 👍/👎 bar shown below each assistant message.
 * On 👎 click, expands inline to ask "what was wrong?" with an optional textarea.
 */
function FeedbackBar({
  state,
  onSubmit,
}: {
  state: 'up' | 'down' | 'submitted' | undefined;
  onSubmit: (vote: 'up' | 'down', comment?: string) => void;
}): JSX.Element {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  if (state === 'submitted') {
    return <div className={styles.feedbackThanks}>Thanks for the feedback! 🙏</div>;
  }

  if (showCommentBox) {
    return (
      <div className={styles.feedbackCommentBox}>
        <textarea
          className={styles.feedbackTextarea}
          placeholder="What was wrong with this answer? (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          maxLength={1000}
        />
        <div className={styles.feedbackCommentActions}>
          <button
            type="button"
            className={styles.feedbackSubmitButton}
            onClick={() => onSubmit('down', comment.trim() || undefined)}
          >
            Submit
          </button>
          <button
            type="button"
            className={styles.feedbackSkipButton}
            onClick={() => onSubmit('down')}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedbackBar}>
      <span className={styles.feedbackPrompt}>Was this helpful?</span>
      <button
        type="button"
        className={styles.feedbackButton}
        onClick={() => onSubmit('up')}
        title="This answer was helpful"
        aria-label="Helpful"
      >
        👍
      </button>
      <button
        type="button"
        className={styles.feedbackButton}
        onClick={() => setShowCommentBox(true)}
        title="This answer was not helpful"
        aria-label="Not helpful"
      >
        👎
      </button>
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  'How do I make an outbound call?',
  'How to send an SMS via API?',
  'How does ExoVerify phone verification work?',
  'What are the Voice API status callbacks?',
  'How to send WhatsApp template messages?',
];

export default function AiChat(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Store sendMessage in a ref so the event listener always has the latest version
  const sendMessageRef = useRef<(q?: string) => void>();

  // Listen for hero search bar "open-ai-chat" events
  useEffect(() => {
    const handleOpenAiChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ question: string }>;
      const question = customEvent.detail?.question;
      if (question) {
        setIsOpen(true);
        // Small delay to ensure panel is rendered
        setTimeout(() => {
          sendMessageRef.current?.(question);
        }, 150);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenAiChat);
    return () => {
      window.removeEventListener('open-ai-chat', handleOpenAiChat);
    };
  }, []);

  const sendMessage = async (questionText?: string) => {
    const question = questionText || input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSources([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: messages.slice(-6), // Last 3 exchanges for context
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errMsg = data.error || `HTTP ${response.status}`;
        if (response.status === 429 || errMsg.includes('busy')) {
          throw new Error('RATE_LIMIT');
        }
        throw new Error(errMsg);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        response_id: data.response_id,
        question,
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.sources?.length) {
        setSources(data.sources);
      }
    } catch (error) {
      const isRateLimit = error instanceof Error && error.message === 'RATE_LIMIT';
      const errorMessage: Message = {
        role: 'assistant',
        content: isRateLimit
          ? 'The AI service is temporarily busy due to high usage. Please wait a moment and try again. In the meantime, you can use the **search bar** at the top for keyword-based search.'
          : 'Sorry, I encountered an error processing your question. Please try again or use the search bar above for keyword-based search.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep sendMessage ref up to date
  sendMessageRef.current = sendMessage;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSources([]);
  };

  // Submit thumbs-up/down (and optional comment) to /api/chat?action=feedback
  const submitFeedback = async (
    messageIndex: number,
    vote: 'up' | 'down',
    comment?: string,
  ) => {
    const msg = messages[messageIndex];
    if (!msg || !msg.response_id) return;

    // Optimistically mark as submitted so the UI updates immediately
    setMessages((prev) =>
      prev.map((m, i) => (i === messageIndex ? { ...m, feedback: 'submitted' } : m)),
    );

    try {
      await fetch('/api/chat?action=feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_id: msg.response_id,
          vote,
          comment: comment || null,
          question: msg.question || null,
          answer_excerpt: (msg.content || '').slice(0, 500),
        }),
      });
    } catch (err) {
      // Best-effort: don't surface errors. The optimistic UI stays.
      console.error('feedback submission failed', err);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonHidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        title="Ask AI about Exotel APIs"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
        <span className={styles.chatButtonLabel}>Ask AI</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.chatPanel}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.aiIndicator}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className={styles.chatTitle}>Exotel AI Assistant</div>
                <a className={styles.chatSubtitle} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Powered by Gemini</a>
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              {messages.length > 0 && (
                <button className={styles.clearButton} onClick={clearChat} title="Clear chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
              <button className={styles.closeButton} onClick={() => setIsOpen(false)} title="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeContainer}>
                <div className={styles.welcomeIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className={styles.welcomeTitle}>Ask me anything about Exotel APIs</h3>
                <p className={styles.welcomeText}>
                  I can help you with Voice, SMS, WhatsApp, ExoVerify, and Call Campaigns APIs.
                </p>
                <div className={styles.suggestedQuestions}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className={styles.suggestedQuestion}
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.message} ${
                    msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className={styles.messageAvatar}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.messageContentWrapper}>
                    <div
                      className={styles.messageContent}
                      dangerouslySetInnerHTML={{
                        __html: msg.role === 'assistant'
                          ? formatMarkdown(msg.content)
                          : msg.content,
                      }}
                    />
                    {msg.role === 'assistant' && msg.response_id && (
                      <FeedbackBar
                        state={msg.feedback}
                        onSubmit={(vote, comment) => submitFeedback(i, vote, comment)}
                      />
                    )}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageAvatar}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && !isLoading && (
              <div className={styles.sourcesContainer}>
                <div className={styles.sourcesTitle}>Sources</div>
                <div className={styles.sourcesList}>
                  {sources.map((source, i) => (
                    <a key={i} href={source.url} className={styles.sourceLink}>
                      <span className={styles.sourceProduct}>{source.product}</span>
                      <span className={styles.sourceTitle}>{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={styles.inputContainer}>
            <textarea
              ref={inputRef}
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Exotel APIs..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className={styles.sendButton}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              title="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
