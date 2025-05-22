// import { Tool } from 'langchain/tools';

// export class CombatTool extends Tool {
//   name = 'simple-combat';
//   description = `Executa uma ação de combate baseada em D&D 5e. Input esperado: 
//   "1" (Atacar), "2" (Fugir), "3" (Magia), ou "4" (Defender). A tool rola dados e simula o resultado com narrativa.`;

//   async _call(input: string): Promise<string> {
//     const roll = (sides: number) => Math.floor(Math.random() * sides) + 1;
//     const choice = input.trim();

//     switch (choice) {
//       case '1': {
//         const rollResult = roll(20);
//         return rollResult >= 15
//           ? `🎯 Ataque certeiro! Você rolou ${rollResult} e acerta um golpe poderoso!`
//           : `😬 Você rolou ${rollResult} e erra o inimigo. Ele contra-ataca com ferocidade!`;
//       }
//       case '2': {
//         const rollResult = roll(20);
//         return rollResult >= 12
//           ? `🏃 Rolou ${rollResult}. Você escapa com sucesso, desaparecendo nas sombras.`
//           : `💥 Rolou ${rollResult}. Você tropeça na fuga e leva um golpe nas costas.`;
//       }
//       case '3': {
//         const damage = roll(8) + roll(8); // 2d8
//         return `🔥 Você conjura magia! Dois dados foram rolados: dano total ${damage} de fogo!`;
//       }
//       case '4': {
//         const rollResult = roll(20);
//         return rollResult >= 10
//           ? `🛡️ Defesa bem-sucedida! Rolou ${rollResult}. Você bloqueia o ataque com precisão.`
//           : `⚔️ Rolou ${rollResult}. Sua defesa falha parcialmente. O impacto é absorvido em parte.`;
//       }
//       default:
//         return '⚠️ Escolha inválida. Use "1" para atacar, "2" para fugir, "3" para magia ou "4" para defender.';
//     }
//   }
// }


import { Tool } from 'langchain/tools';

type CombatState = {
  playerHP: number;
  enemyHP: number;
  turn: 'player' | 'enemy';
};

const initialState: CombatState = {
  playerHP: 20,
  enemyHP: 15,
  turn: 'player',
};

let combatState: CombatState | null = null;

export class CombatTool extends Tool {
  name = 'simple-combat';
  description = ` 
Inicia ou continua um combate baseado em turnos. Input esperado:
- "iniciar" para começar o combate.
- "1" (Atacar), "2" (Fugir), "3" (Magia), ou "4" (Defender) para ações do jogador.
O sistema simula rolagens de dados e atualiza o estado da luta.
  `;

  async _call(input: string): Promise<string> {
    const roll = (sides: number) => Math.floor(Math.random() * sides) + 1;
    const action = input.trim().toLowerCase();

    if (action === 'iniciar') {
      combatState = { ...initialState };
      const iniciativaJogador = roll(20);
      const iniciativaInimigo = roll(20);
      combatState.turn = iniciativaJogador >= iniciativaInimigo ? 'player' : 'enemy';

      return `🧙‍♂️ Um inimigo apareceu com 15 HP!\n🎲 Iniciativas: Jogador ${iniciativaJogador}, Inimigo ${iniciativaInimigo}.\n🔄 Turno de: ${combatState.turn === 'player' ? 'Você' : 'o inimigo'}`;
    }

    if (!combatState) {
      return '⚠️ O combate ainda não começou. Digite "iniciar" para começar.';
    }

    if (combatState.playerHP <= 0 || combatState.enemyHP <= 0) {
      const result = combatState.enemyHP <= 0 ? '🏆 Vitória!' : '💀 Derrota!';
      combatState = null;
      return `🎯 Combate finalizado. ${result}`;
    }

    if (combatState.turn === 'enemy') {
      const enemyRoll = roll(20);
      const damage = roll(6);
      const result = enemyRoll >= 12 ? `⚔️ O inimigo ataca e causa ${damage} de dano.` : `😅 O inimigo erra o ataque.`;

      if (enemyRoll >= 12) combatState.playerHP -= damage;
      combatState.turn = 'player';

      return `${result}\n❤️ Seu HP: ${combatState.playerHP}, 🧟 Inimigo: ${combatState.enemyHP}`;
    }

    switch (action) {
      case '1': {
        const attackRoll = roll(20);
        const damage = roll(8);
        let result = `🎯 Você rolou ${attackRoll}. `;

        if (attackRoll >= 14) {
          combatState.enemyHP -= damage;
          result += `Acertou! Dano causado: ${damage}.`;
        } else {
          result += 'Você errou o ataque.';
        }

        combatState.turn = 'enemy';
        return `${result}\n❤️ Seu HP: ${combatState.playerHP}, 🧟 Inimigo: ${combatState.enemyHP}`;
      }

      case '2': {
        const escape = roll(20);
        if (escape >= 15) {
          combatState = null;
          return `🏃 Você rolou ${escape} e conseguiu escapar! Combate encerrado.`;
        }
        combatState.turn = 'enemy';
        return `🚪 Você falhou em escapar (rolou ${escape}). O inimigo se prepara para atacar.`;
      }

      case '3': {
        const damage = roll(6) + roll(6);
        combatState.enemyHP -= damage;
        combatState.turn = 'enemy';
        return `🔥 Você conjura magia! Dano causado: ${damage}.\n❤️ Seu HP: ${combatState.playerHP}, 🧟 Inimigo: ${combatState.enemyHP}`;
      }

      case '4': {
        const block = roll(20);
        if (block >= 12) {
          combatState.turn = 'enemy';
          return `🛡️ Você se defende com sucesso (rolou ${block}). O próximo ataque será reduzido.`;
        } else {
          combatState.turn = 'enemy';
          return `🛡️ Defesa falha (rolou ${block}). Prepare-se para o contra-ataque.`;
        }
      }

      default:
        return '⚠️ Ação inválida. Use "1" para atacar, "2" para fugir, "3" para magia ou "4" para defender.';
    }
  }
}

