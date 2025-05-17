import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
// @ts-expect-error pdf-parse has no types
import pdfParse from "pdf-parse/lib/pdf-parse";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const user = await getCurrentUser();

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const pdfText = await pdfParse(buffer);

  const prompt = `
        Here is the resume content in json format:
        "${pdfText.text}"

        Please extract the main job role or title, level of experience, and list of key skills from this resume.
        Return it in JSON format with fields "role","level" and "skills" (array).`;

  try {
    // Request AI to generate a response
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    // Clean the response to remove markdown formatting
    const cleanedResponse = response.text.replace(/```json|```/g, "").trim();

    // Parse the cleaned response to JSON
    const { role, level, skills } = JSON.parse(cleanedResponse);

    const interviewPrompt =
      // ` حضّر مقابلة عمل.
      //     الدور الوظيفي هو: ${role}.
      //     مستوى الخبرة المطلوب هو: ${level}.
      //     التقنيات المستخدمة في الوظيفة هي: ${skills.join(", ")}.
      //     يجب أن يكون التركيز في الأسئلة مزيجًا بين الأسئلة السلوكية والتقنية.
      //     عدد الأسئلة المطلوب توليدها هو: 10.
      //     رجاءً توليد الأسئلة باللغة العربية المصرية فقط.
      //     يُرجى إنشاء 10 أسئلة فقط، تحتوي على مزيج متوازن من الأسئلة التقنية والسلوكية.
      //     يرجى إرجاع الأسئلة فقط بدون أي نص إضافي.
      //     سيتم قراءة الأسئلة من خلال مساعد صوتي، لذلك يُرجى عدم استخدام الرموز الخاصة مثل "/" أو "*" أو أي رموز قد تسبب مشاكل في القراءة.
      //     قم بإرجاع الأسئلة بتنسيق كالتالي:
      //     ["السؤال 1", "السؤال 2", "السؤال 3"]

      //     شكرًا لك! <3
      // `;
      `
      Prepare a for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${skills.join(", ")}.
      The focus between behavioural and technical questions should lean towards: mixed.
      The amount of questions required is: 10.
      Focus on generating 10 questions in total, with a balanced mix of technical and behavioral questions.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]

      Thank you! <3`;

    // Request AI to generate interview questions
    const questionsResponse = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: interviewPrompt,
    });

    const questions = JSON.parse(questionsResponse.text);

    const interview = {
      role,
      level,
      techstack: skills,
      questions,
      userId: user?.id,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    // Add the interview to the database
    await db.collection("interviews").add(interview);

    // Return success response with generated data
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return Response.json(
      { error: "AI request failed or issue with processing resume" },
      { status: 500 }
    );
  }
}
