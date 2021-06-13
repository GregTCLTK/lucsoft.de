import { richCard } from '@lucsoft/webgen';

import type { gameData } from '../types';

export const renderLoseView = (game: gameData, resetGame: () => void) => [
    richCard({
        title: 'You Lose!',
        content: `The word was ${game.word}. Hopefully you get it faster next round.`,
        buttons: [
            {
                color: "red",
                action: () => resetGame(),
                title: 'Go back'
            }
        ]
    })
]