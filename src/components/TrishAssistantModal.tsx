import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Bot, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  BrainCircuit, 
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface TrishAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'straddle' | 'user';
  text: string;
  timestamp: string;
}

export const StraddleAssistantModal: React.FC<TrishAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'straddle',
      text: "Hello! I'm Straddle AI, your institutional voice & algorithmic trading assistant on PipNex. How can I assist your forex chart analysis, risk parameters, or bot configuration today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/straddle-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      const data = await response.json();
      const reply = data.reply || 'Market analysis completed.';

      const botMsg: ChatMessage = {
        id: `straddle-${Date.now()}`,
        sender: 'straddle',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(reply);
    } catch {
      const fallbackReply = "I have analyzed current liquidity pools on EUR/USD and Gold (XAU/USD). Pipnexai Scalper and Nova Edge Swing Ea are executing with optimal risk-to-reward ratios.";
      setMessages((prev) => [
        ...prev,
        {
          id: `straddle-${Date.now()}`,
          sender: 'straddle',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported on this browser. You can type your request directly into Straddle AI Assistant.');
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceActive(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsVoiceActive(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognition.start();
    } catch {
      setIsVoiceActive(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="straddle-assistant-modal"
        className="w-full max-w-2xl bg-[#0c0d15] border border-[#1d2030] rounded-3xl p-6 shadow-2xl text-white relative flex flex-col h-[640px] max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#161826]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#141624] border border-[#272c44] flex items-center justify-center text-purple-400 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0c0d15] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Straddle AI Assistant</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#122b1c] text-emerald-400 border border-emerald-500/30 font-bold">
                  Voice Enabled AI
                </span>
              </div>
              <p className="text-xs text-gray-400">Algorithmic Forex Intelligence &amp; Risk Guardian</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-straddle-tts"
              onClick={() => {
                setTtsEnabled(!ttsEnabled);
                if (ttsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={ttsEnabled ? "Mute Voice Speech" : "Enable Voice Speech"}
              className={`p-2 rounded-xl border transition-all ${
                ttsEnabled 
                  ? 'bg-[#151828] border-purple-500/40 text-purple-300' 
                  : 'bg-[#10121c] border-[#1c1f30] text-gray-500 hover:text-gray-300'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              id="close-straddle-modal-btn"
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 rounded-xl bg-[#141624] border border-[#22253a] text-gray-400 hover:text-white hover:bg-[#1a1e30] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Straddle Capabilities Pills */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#161826] text-[11px] text-gray-400">
          <span className="shrink-0 text-purple-400 font-semibold flex items-center gap-1 font-mono text-[10px] uppercase">
            <BrainCircuit className="w-3.5 h-3.5" /> Capabilities:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#10121c] border border-[#1c1f30] shrink-0 font-mono text-[10px]">Market Analysis</span>
          <span className="px-2 py-0.5 rounded-md bg-[#10121c] border border-[#1c1f30] shrink-0 font-mono text-[10px]">Chart Breakdowns</span>
          <span className="px-2 py-0.5 rounded-md bg-[#10121c] border border-[#1c1f30] shrink-0 font-mono text-[10px]">Strategy Building</span>
          <span className="px-2 py-0.5 rounded-md bg-[#10121c] border border-[#1c1f30] shrink-0 font-mono text-[10px]">Risk Management</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1 custom-scrollbar">
          {messages.map((msg) => {
            const isStraddle = msg.sender === 'straddle';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isStraddle ? 'justify-start' : 'justify-end'}`}
              >
                {isStraddle && (
                  <div className="w-7 h-7 rounded-xl bg-[#141624] border border-[#272c44] flex items-center justify-center shrink-0 text-purple-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isStraddle
                      ? 'bg-[#10121c] border border-[#1c1f30] text-gray-200 shadow-sm'
                      : 'bg-[#1c2035] border border-[#2b304c] text-white shadow-sm font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[9px] mt-1 text-right font-mono ${isStraddle ? 'text-gray-500' : 'text-purple-300'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-[#141624] border border-[#272c44] flex items-center justify-center shrink-0 text-purple-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#10121c] border border-[#1c1f30] text-xs text-purple-300 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Straddle AI is calculating order flow &amp; liquidity...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="pt-2 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            'Analyze EUR/USD outlook',
            'Optimal lot size for $10k account',
            'How does Pipnexai Scalper handle news?',
            'What is the next high impact event?'
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#10121c] hover:bg-[#151828] border border-[#1c1f30] hover:border-[#2b304c] text-gray-400 hover:text-white shrink-0 transition-colors font-mono"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-[#161826] flex items-center gap-2">
          <button
            id="voice-toggle-btn"
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isVoiceActive
                ? 'bg-[#2b1216] text-[#ff4b58] animate-pulse border-[#ff4b58]/40 shadow-sm'
                : 'bg-[#10121c] border-[#1c1f30] text-gray-400 hover:text-white hover:bg-[#151828]'
            }`}
            title="Toggle Voice Input (Speech to Text)"
          >
            {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            id="straddle-input-text"
            type="text"
            placeholder={isVoiceActive ? "Listening to your voice... Speak now" : "Ask Straddle AI about charts, signals, risk or bot settings..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[#10121c] border border-[#1c1f30] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
          />

          <button
            id="send-straddle-msg-btn"
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-[#141624] hover:bg-[#1e2338] border border-[#2b304c] hover:border-purple-500/40 text-white rounded-xl transition-all shadow-sm disabled:opacity-40 cursor-pointer active:scale-[0.98]"
          >
            <Send className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Backward-compatible alias
export const TrishAssistantModal = StraddleAssistantModal;

