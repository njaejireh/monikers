# Monikers

A playable concept of the Monikers party game, designed and built by Jae. Unofficial fan project with an original card deck.

## Run it

- Double-click `index.html` to open it in your browser, or
- In VS Code, install the **Live Server** extension (VS Code will suggest it), then right-click `index.html` and choose **Open with Live Server**. The page reloads every time you save.

## Files

- `index.html` holds the page and the iPhone frame
- `css/styles.css` holds all styles. Colors and fonts are the tokens at the top.
- `js/cards.js` holds the card deck. Each card is `[name, description, category, points]`.
- `js/app.js` holds the screens and game logic. Rules live near the top: `TURN_MS`, `PER_PLAYER`, `EXTRA`, `MIN_P`, `MAX_P`, and the round rules in `ROUNDS`.

## Controls

- Swipe the card right for Correct, left for Pass, or use the buttons
- On a keyboard: right arrow = Correct, left arrow = Pass, space = pause

## Credits

- Dice icon: `dices` from [Lucide](https://lucide.dev), licensed [ISC](https://lucide.dev/license).

## Design rules

All design tokens live at the top of `css/styles.css` in `:root`. To restyle something, change a token there. Don't override values inside a screen's rules.

### Three layers

1. **Primitives:** raw values from Figma, like `--primary`, `--secondary-edge` and the font sizes `--fs-*`
2. **Semantic:** what a value is for, like `--text-muted`, `--border`, `--radius-lg`, `--space-4` and type roles such as `--type-heading-*`
3. **Component:** one group per component, like `--appbar-*`, `--btn-*`, `--card-*`, `--step-*` and `--avatar-*`

Components only read from layers 2 and 3.

### Type roles

| Role | Size / line / weight | Used for |
|---|---|---|
| Display | 26 / 1.2 / 800 | Big statements ("Pass the phone to Team A") |
| Title | 22 / 28 / 700 | Top app bar titles |
| Heading | 20 / 1.3 / 800 | Screen questions ("Who's playing?") |
| Body | 16 / 1.5 / 400 | Sentences |
| Caption | 14 / 20 / 400 | Lines under titles, counts |
| Label | 14, 600, uppercase, .1em tracking | "TEAM 1" |

### Top app bar

Material calls it a center-aligned top app bar, and iOS calls it a navigation bar. It's 64px tall, with a Title-role title and an optional Caption-role line under it. Tokens: `--appbar-*`. Dark and colored screens swap only the color tokens.

### Buttons

Every button uses `.btn` plus one variant class. Variants only choose colors, and the base rule draws everything else: height 55, radius 10, 20px bold text, 2px border and a 4px solid edge that disappears when pressed.

| Class | Use |
|---|---|
| `.btn-red` | Primary action (Next, Done, Let's go) |
| `.btn-line` | Secondary action, icon buttons beside the primary |
| `.btn-white` | Primary action on red or colored screens |
| `.btn-ghost` | Low-emphasis action on colored screens |
| `.btn-pass` / `.btn-ok` | Turn buttons |
