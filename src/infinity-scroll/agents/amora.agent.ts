// amora.agent.ts
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  AIMessagePromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ImageTool } from './tools/image.tool';
import { CombatTool } from './tools/combat.toos';
import { BufferMemory } from 'langchain/memory';

export async function createGirlfriendAgent(profile: any, memory?: BufferMemory) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not defined');
  }

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: profile.ai_settings?.temperature ?? 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const tools = [new ImageTool(), new CombatTool()];
  const systemPrompt = profile.ai_settings?.systemPrompt ?? "Você é uma namorada virtual carinhosa, prestativa e divertida.";

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    AIMessagePromptTemplate.fromTemplate("{agent_scratchpad}"),
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    // verbose: true, Exibe todos os traces da LLM 
    memory,
  });

  return executor;
} 