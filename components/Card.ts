import { Card, Component, Horizontal, PlainText, Spacer, Vertical } from "https://raw.githubusercontent.com/lucsoft/WebGen/104bc41/mod.ts";

export function SmallCard(text = "--", description: string): [ settings: {
    width?: number | undefined;
    heigth?: number | undefined;
}, element: Component ] {
    return [
        { width: 4, heigth: 1 },
        Card(Vertical(
            Horizontal(
                PlainText(text)
                    .setFont(2.3, 900)
                    .addClass("font-big"),
                Spacer()
            ).setMargin("1.2rem 1rem 0.2rem"),
            Horizontal(
                PlainText(description)
                    .setFont(0.88, 500),
                Spacer()
            ).setMargin("0 1rem"),
            Spacer()
        ))
    ];
}
