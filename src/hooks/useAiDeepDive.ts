
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 管理AI自我探索的對話流程 (openai chat API, stream)
 */
export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function useAiDeepDive(initThought: string, initialMessages?: AiMessage[], onConversationUpdate?: (messages: AiMessage[]) => void) {
  const [messages, setMessages] = useState<AiMessage[]>(() => {
    // 如果有初始對話記錄，使用它；否則使用預設的系統訊息
    if (initialMessages && initialMessages.length > 0) {
      console.log("useAiDeepDive: Loading existing conversation with", initialMessages.length, "messages");
      return initialMessages;
    }
    
    return [
      {
        role: "system" as const,
        content:
          "你是一位溫和、自我探索專家，請引導使用者深入思考與釐清他的思緒。每次請只問一個問題，語氣友善並鼓勵對方真誠作答。"
      },
      { role: "user" as const, content: initThought }
    ];
  });
  
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem("openai_api_key") || "");

  // 當 messages 更新時，通知父組件保存對話
  useEffect(() => {
    if (onConversationUpdate && messages.length > 2) { // 只有當有實際對話時才保存
      console.log("useAiDeepDive: Conversation updated, saving", messages.length, "messages");
      onConversationUpdate(messages);
    }
  }, [messages, onConversationUpdate]);

  // 主動更新API KEY/本地存儲
  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    window.localStorage.setItem("openai_api_key", key);
  }, []);

  // 發送一則user內容給AI
  const sendMessage = useCallback(
    async (userContent: string) => {
      if (!apiKey) {
        setError("請先輸入有效的 OpenAI API 金鑰");
        return;
      }
      setError(null);
      setMessages(prev => [...prev, { role: "user" as const, content: userContent }]);
      setAnswering(true);

      try {
        // 組chat messages (保留最近 6輪)
        const chatMessages = [
          ...messages.filter(msg => msg.role !== "system"),
          { role: "user" as const, content: userContent }
        ].slice(-6);

        // OpenAI stream fetch
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "你是一位溫和、自我探索專家，請引導使用者深入思考與釐清他的思緒。每次請只問一個問題，語氣友善並鼓勵對方真誠作答。"
              },
              ...chatMessages
            ],
            stream: true,
            max_tokens: 256,
            temperature: 0.7
          })
        });

        if (!response.ok || !response.body) {
          setError("連線失敗或金鑰錯誤。");
          setAnswering(false);
          return;
        }
        // 處理stream
        const reader = response.body.getReader();
        let fullText = "";
        let done = false;

        // 預先插入「assistant:」空訊息
        setMessages(prev => [...prev, { role: "assistant" as const, content: "" }]);

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (value) {
            // 這段根據OpenAI stream schema
            const chunk = new TextDecoder("utf-8").decode(value);
            const lines = chunk
              .split("\n")
              .filter(line => line.trim().startsWith("data: "))
              .map(line => line.replace("data: ", "").trim())
              .filter(line => line !== "" && line !== "[DONE]");
            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                const text = json.choices?.[0]?.delta?.content;
                if (text) {
                  fullText += text;
                  setMessages(prev =>
                    prev.map((msg, idx) =>
                      idx === prev.length - 1 && msg.role === "assistant"
                        ? { ...msg, content: fullText }
                        : msg
                    )
                  );
                }
              } catch (err) {
                // 忽略非json片段
              }
            }
          }
          done = readerDone;
        }
      } catch (e: any) {
        setError(e?.message || "錯誤，請稍後再試");
      }
      setAnswering(false);
    },
    [apiKey, messages]
  );

  const reset = useCallback(() => {
    const newMessages: AiMessage[] = [
      {
        role: "system" as const,
        content:
          "你是一位溫和、自我探索專家，請引導使用者深入思考與釐清他的思緒。每次請只問一個問題，語氣友善並鼓勵對方真誠作答。"
      },
      { role: "user" as const, content: initThought }
    ];
    setMessages(newMessages);
    setError(null);
    setAnswering(false);
    console.log("useAiDeepDive: Conversation reset");
  }, [initThought]);

  return {
    messages,
    answering,
    error,
    apiKey,
    saveApiKey,
    sendMessage,
    reset
  };
}
