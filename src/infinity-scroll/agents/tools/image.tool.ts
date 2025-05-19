// tools/image.tool.ts
import { Tool } from 'langchain/tools';

export class ImageTool extends Tool {
  name = 'image-generator';
  description = 'Gera imagens românticas, fofas ou criativas com base na descrição';

  async _call(input: string): Promise<string> {
    return `https://fake.image.ai/${encodeURIComponent(input)}.png`;
  }
}
