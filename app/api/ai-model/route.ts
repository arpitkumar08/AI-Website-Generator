import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Use fetch instead of axios for streaming
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "My Next.js App",
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini", // Use a valid model
                    messages,
                    stream: true,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", errorText);
            return NextResponse.json(
                { error: `API error: ${response.status}` },
                { status: response.status }
            );
        }

        // Get the readable stream from the response
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No response body");
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        // Create a new readable stream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.close();
                            break;
                        }

                        // Decode the chunk
                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split("\n");

                        for (const line of lines) {
                            if (line.startsWith("data: ")) {
                                const data = line.slice(6); // Remove "data: " prefix

                                if (data === "[DONE]") {
                                    controller.close();
                                    return;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content;

                                    if (content) {
                                        controller.enqueue(encoder.encode(content));
                                    }
                                } catch (e) {
                                    // Skip invalid JSON
                                    console.warn("Failed to parse SSE data:", data);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}