import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Convert file to buffer and create a File object for OpenAI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a File object that OpenAI can process
    const pdfFile = new File([buffer], file.name, { type: "application/pdf" });

    console.log("📄 Extracting text from PDF using OpenAI...");

    // Upload file to OpenAI and extract text using the Assistants API
    const uploadedFile = await openai.files.create({
      file: pdfFile,
      purpose: "assistants",
    });

    // Create a temporary assistant to extract text
    const assistant = await openai.beta.assistants.create({
      name: "PDF Text Extractor",
      instructions: "Extract all text content from the uploaded PDF file. Return only the text content without any formatting or additional commentary.",
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
    });

    // Create a thread with the file
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "Please extract all the text content from this PDF file.",
          attachments: [
            {
              file_id: uploadedFile.id,
              tools: [{ type: "file_search" }],
            },
          ],
        },
      ],
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    if (run.status !== "completed") {
      throw new Error(`PDF extraction failed with status: ${run.status}`);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find((msg) => msg.role === "assistant");
    
    if (!assistantMessage || !assistantMessage.content[0]) {
      throw new Error("No text content extracted from PDF");
    }

    const textContent = assistantMessage.content[0];
    const text = textContent.type === "text" ? textContent.text.value : "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text content found in PDF" },
        { status: 400 },
      );
    }

    console.log(`✅ Extracted ${text.length} characters from PDF`);

    // Clean up OpenAI resources
    await openai.beta.assistants.del(assistant.id);
    await openai.files.del(uploadedFile.id);

    // Now create a HeyGen Knowledge Base with this content
    console.log("📚 Creating HeyGen Knowledge Base...");

    const heygenApiKey = process.env.HEYGEN_API_KEY;
    if (!heygenApiKey) {
      throw new Error("HEYGEN_API_KEY environment variable is not set");
    }

    console.log("🔑 API Key present:", heygenApiKey.substring(0, 10) + "...");

    const requestBody = {
      name: file.name.replace(".pdf", ""),
      opening: "Hello! I have information from the uploaded document. How can I help you?",
      prompt: `You are a helpful AI assistant with access to the following document content. Answer questions based on this information:\n\n${text}`,
    };

    console.log("📤 Sending to HeyGen:", { 
      name: requestBody.name, 
      openingLength: requestBody.opening.length,
      promptLength: requestBody.prompt.length 
    });

    const heygenResponse = await fetch("https://api.heygen.com/v1/streaming/knowledge_base/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": heygenApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📥 HeyGen Response Status:", heygenResponse.status, heygenResponse.statusText);
    
    if (!heygenResponse.ok) {
      // Try to get the response text first to see what we're getting
      const responseText = await heygenResponse.text();
      console.error("HeyGen API error response:", responseText.substring(0, 500));
      
      // Try to parse as JSON if possible
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(`HeyGen API error: ${errorData.message || heygenResponse.statusText}`);
      } catch (e) {
        throw new Error(`HeyGen API error (${heygenResponse.status}): ${responseText.substring(0, 200)}`);
      }
    }

    const heygenData = await heygenResponse.json();
    console.log("📦 HeyGen Response Data:", JSON.stringify(heygenData, null, 2));

    // Try different possible response structures
    const knowledgeId = 
      heygenData.data?.knowledge_base_id || 
      heygenData.knowledge_base_id ||
      heygenData.data?.id ||
      heygenData.id;

    if (!knowledgeId) {
      console.error("Could not find knowledge base ID in response:", heygenData);
      throw new Error("No knowledge base ID returned from HeyGen");
    }

    console.log("✅ HeyGen Knowledge Base created:", knowledgeId);

    return NextResponse.json({
      knowledgeId,
      message: "PDF processed successfully and HeyGen Knowledge Base created",
      textLength: text.length,
      heygenKnowledgeBaseId: knowledgeId,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process PDF",
      },
      { status: 500 },
    );
  }
}

