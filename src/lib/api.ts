// API utility for ALFRED FastAPI backend
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export async function sendMentorMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const res = await fetch(`${FASTAPI_BASE_URL}/mentor/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Alfred API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Placeholder: returns a mock response for UI testing without a live backend
export async function mockMentorMessage(
  message: string
): Promise<ChatResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const responses: Record<string, string> = {
    default: "Discipline. Execution. Consistency.",
    focus: "Identify your highest-leverage task. Execute with precision.",
    motivation: "The mission does not pause for emotion. Adapt and proceed.",
    plan: "Analyze variables. Eliminate noise. Execute the optimal path.",
  };

  const key = Object.keys(responses).find((k) =>
    message.toLowerCase().includes(k)
  );
  return {
    response: responses[key ?? "default"],
    timestamp: new Date().toISOString(),
  };
}
