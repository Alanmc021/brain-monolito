// tools/image.tool.ts
import { Tool } from 'langchain/tools';

export class ImageTool extends Tool {
  name = 'image-generator';
  description = 'Quando tiver um combate gere uma image ou quando jogar pedir gere a imgem';

  async _call(input: string): Promise<string> {
    return `https://fake.image.ai/${encodeURIComponent(input)}.png`;
  }
}
