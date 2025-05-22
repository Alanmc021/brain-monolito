import { DynamicTool } from 'langchain/tools';

export const loadCharacterTool = new DynamicTool({
  name: 'load-character',
  description: 'Carrega dados do personagem atual para a narrativa e ações baseadas em atributos.',
  func: async (_input: string) => {
    // Personagem mockado (pode ser substituído por dados do banco futuramente)
    const mockCharacter = {
      name: 'Lorde Beijo na Bumba',
      level: 2,
      stats: {
        strength: 14,
        intelligence: 8,
        agility: 10,
        vitality: 12,
        wisdom: 10,
        charisma: 10,
      },
      inventory: ['Espada Longa', 'Poção de Cura'],
      equipped: {
        weapon: 'Espada Longa',
        armor: 'Cota de Couro'
      },
      status: 'normal',
    };

    return `🧙 Personagem:
Nome: ${mockCharacter.name}
Nível: ${mockCharacter.level}
Força: ${mockCharacter.stats.strength}
Inteligência: ${mockCharacter.stats.intelligence}
Agilidade: ${mockCharacter.stats.agility}
Vitalidade: ${mockCharacter.stats.vitality}
Sabedoria: ${mockCharacter.stats.wisdom}
Carisma: ${mockCharacter.stats.charisma}
Equipado: Arma: ${mockCharacter.equipped.weapon}, Armadura: ${mockCharacter.equipped.armor}
Inventário: ${mockCharacter.inventory.join(', ')}
Status: ${mockCharacter.status}
`;
  }
});
