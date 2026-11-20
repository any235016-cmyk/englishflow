export interface AITutorResponse {
  reply: string;
  translation: string;
  grammarTip: string;
  suggestedChips: string[];
}

const scenarioResponses: Record<
  string,
  { keywords: string[]; reply: string; translation: string; grammarTip: string; suggestedChips: string[] }[]
> = {
  'sc1': [ // At a Cafe
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      reply: "Hello! Welcome! What would you like today? Coffee or tea?",
      translation: "مرحباً! أهلاً بك! ماذا تود اليوم؟ قهوة أم شاي؟",
      grammarTip: "Notice 'would like' is a polite way to ask or say what you want.",
      suggestedChips: ["I would like a coffee, please.", "Can I have a tea?", "What do you recommend?"],
    },
    {
      keywords: ['coffee', 'espresso', 'cappuccino', 'latte'],
      reply: "Great choice! Would you like milk and sugar with your coffee?",
      translation: "خيار رائع! هل تحب الحليب والسكر مع قهوتك؟",
      grammarTip: "Use 'with' to add items (e.g. coffee with milk).",
      suggestedChips: ["With milk, no sugar please.", "Black coffee, please.", "How much is it?"],
    },
    {
      keywords: ['tea', 'green tea', 'black tea'],
      reply: "Hot tea coming right up! Would you like a slice of cake with that?",
      translation: "الشاي الساخن قادم مباشرة! هل تود قطعة كعك مع ذلك؟",
      grammarTip: "Use 'slice of' for things like cake, pizza, or bread.",
      suggestedChips: ["Yes, chocolate cake please.", "No thank you, just the tea.", "How much is the bill?"],
    },
    {
      keywords: ['how much', 'bill', 'price', 'cost', 'pay'],
      reply: "That will be $4.50, please. Will you be paying with cash or card?",
      translation: "الحساب سيكون 4.50 دولار من فضلك. هل ستدفع نقداً أم بالبطاقة؟",
      grammarTip: "'Will you be paying...' is a common polite question in shops.",
      suggestedChips: ["I will pay by card.", "Here is $5 cash.", "Thank you very much!"],
    },
    {
      keywords: ['card', 'cash', 'pay', 'thanks', 'thank you'],
      reply: "Here is your order! Enjoy your drink and have a wonderful day!",
      translation: "إليك طلبك! استمتع بمشروبك وأتمنى لك يوماً رائعاً!",
      grammarTip: "'Enjoy your...' is used when giving food, drink, or an experience.",
      suggestedChips: ["Thank you! Goodbye!", "You too! Have a nice day.", "Where is the bathroom?"],
    },
  ],
  'sc2': [ // Asking for Directions
    {
      keywords: ['hello', 'hi', 'excuse me', 'help', 'lost'],
      reply: "Hello! Don't worry, I can help you. Where are you trying to go?",
      translation: "مرحباً! لا تقلق، أستطيع مساعدتك. إلى أين تحاول الذهاب؟",
      grammarTip: "'Where are you trying to go?' uses Present Continuous for current intention.",
      suggestedChips: ["Where is the train station?", "I am looking for a hotel.", "How do I get to the museum?"],
    },
    {
      keywords: ['station', 'train', 'bus'],
      reply: "Go straight ahead for two blocks, then turn left. It's right next to the bank!",
      translation: "امشِ مباشرة للأمام لمسافة مجمعين، ثم انعطف يساراً. إنه بجوار البنك تماماً!",
      grammarTip: "'Straight ahead' means forward. 'Turn left/right' gives direction.",
      suggestedChips: ["Is it far from here?", "Thank you so much!", "Can I walk there?"],
    },
    {
      keywords: ['hotel', 'museum', 'far', 'walk'],
      reply: "It is about a 5-minute walk from here. Very close!",
      translation: "إنه على بعد 5 دقائق سيراً على الأقدام من هنا. قريب جداً!",
      grammarTip: "Use 'a [number]-minute walk' to describe walking distance.",
      suggestedChips: ["Thank you for your help!", "Have a great day!", "Goodbye!"],
    },
  ],
  'sc3': [ // Shopping for Clothes
    {
      keywords: ['hello', 'hi', 'help', 'looking', 'buy'],
      reply: "Hi! Welcome to our store! We have great shirts and jackets today.",
      translation: "أهلاً! مرحباً بك في متجرنا! لدينا قمصان وسترات رائعة اليوم.",
      grammarTip: "'We have...' is simple present showing what the shop offers.",
      suggestedChips: ["Do you have this shirt in medium?", "How much is this jacket?", "Where are the fitting rooms?"],
    },
    {
      keywords: ['medium', 'small', 'large', 'size'],
      reply: "Yes, we have medium in blue and white! Would you like to try it on?",
      translation: "نعم، لدينا مقاس متوسط باللون الأزرق والأبيض! هل تحب أن تجربه؟",
      grammarTip: "'Try it on' means to wear clothes briefly to test size.",
      suggestedChips: ["Yes, where is the fitting room?", "How much does it cost?", "I'll take the blue one!"],
    },
  ],
};

const defaultResponses: AITutorResponse[] = [
  {
    reply: "That is great! Practicing English every day will make you fluent quickly. What else would you like to talk about?",
    translation: "هذا رائع! ممارسة الإنجليزية يومياً ستجعلك طليقاً بسرعة. عن ماذا تود أن نتحدث أيضاً؟",
    grammarTip: "'Practicing' as a noun (gerund) serves as the subject of the sentence.",
    suggestedChips: ["Can you ask me a question?", "I want to practice ordering food.", "How do I say 'شكراً' in English?"],
  },
  {
    reply: "Very good! Your sentence is very clear. Let's keep practicing!",
    translation: "ممتاز جداً! جملتك واضحة للغاية. لنواصل التمرين!",
    grammarTip: "'Very' adds emphasis to adjectives like 'good' or 'clear'.",
    suggestedChips: ["Let's talk about family.", "What is your favorite food?", "Can you correct my grammar?"],
  },
];

export function getAITutorResponse(scenarioId: string, userMessage: string): AITutorResponse {
  const msgLower = userMessage.toLowerCase().trim();
  const scenarios = scenarioResponses[scenarioId] || [];

  for (const item of scenarios) {
    if (item.keywords.some((kw) => msgLower.includes(kw))) {
      return {
        reply: item.reply,
        translation: item.translation,
        grammarTip: item.grammarTip,
        suggestedChips: item.suggestedChips,
      };
    }
  }

  // Random fallback from defaults
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
}
