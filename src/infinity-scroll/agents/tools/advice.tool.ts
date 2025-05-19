import { Tool } from 'langchain/tools';

export class CombatTool extends Tool {
  name = 'simple-combat';
  description = 'Simula um combate RPG baseado na escolha do jogador (1 = atacar, 2 = fugir, 3 = magia, 4 = defesa)';

  async _call(input: string): Promise<string> {
    const choice = input.trim();

    switch (choice) {
      case '1':
        return '💥 Você avança com sua espada e acerta o inimigo em cheio! Ele cambaleia para trás, ferido.';
      case '2':
        return '🏃‍♂️ Você tenta fugir... e consegue escapar por pouco! Sua respiração está ofegante.';
      case '3':
        return '🔥 Você conjura uma bola de fogo! Ela explode no inimigo, causando dano massivo mágico.';
      case '4':
        return '🛡️ Você levanta seu escudo e assume uma postura defensiva. O próximo ataque será menos eficaz.';
      default:
        return '🤔 Escolha inválida. Digite 1 para atacar, 2 para fugir, 3 para usar magia ou 4 para se defender.';
    }
  }
}
