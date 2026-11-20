import { NextResponse } from 'next/server';
import { getAITutorResponse } from '@/lib/aiTutor';

export async function POST(req: Request) {
  try {
    const { message, scenarioId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fallback engine is fast, deterministic, and works immediately out of the box
    const tutorResponse = getAITutorResponse(scenarioId || 'sc1', message);

    return NextResponse.json({
      reply: tutorResponse.reply,
      translation: tutorResponse.translation,
      grammarTip: tutorResponse.grammarTip,
      suggestedChips: tutorResponse.suggestedChips,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
