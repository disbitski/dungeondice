# Dungeon Dice

Dungeon Dice is a simple Alexa skill that rolls classic tabletop RPG dice by
voice. Ask for a D4, D6, D8, D10, D12, or D20 and Alexa responds with the roll,
including a little extra flavor for critical hits and critical failures.

The live skill can still be enabled from Amazon:
[Dungeon Dice on Amazon](https://www.amazon.com/DaveDev-Productions-Dungeon-Dice/dp/B01EK2OZSG/)

## Why This Exists

I originally wrote Dungeon Dice while I was working at Alexa. It is intentionally
small, which makes it a useful example for learning the core pieces of a custom
Alexa skill:

- Handling `LaunchRequest`, `IntentRequest`, and `SessionEndedRequest`
- Reading slot values from an intent
- Returning SSML speech, cards, reprompts, and session state
- Mapping sample utterances to a custom slot type
- Hosting simple skill logic in an AWS Lambda function

The Alexa platform has evolved since this was created, but the project is still
a good reference for the basic request/response flow behind a voice skill.

## What It Can Roll

Dungeon Dice supports the most common fantasy tabletop dice:

| Die | Sides |
| --- | --- |
| D4 | 4 |
| D6 | 6 |
| D8 | 8 |
| D10 | 10 |
| D12 | 12 |
| D20 | 20 |

Example phrases:

- "Alexa, open Dungeon Dice"
- "Roll a D20"
- "Roll a six sided die"
- "Give me a D12"

## Project Structure

| File | Purpose |
| --- | --- |
| `DungeonDice.js` | Lambda handler and skill response logic |
| `schemas.js` | Interaction model notes: intents, custom slot values, and sample utterances |
| `dd108x108.jpg` | Small Alexa skill icon |
| `dd512x512.jpg` | Large Alexa skill icon |

## How The Skill Works

The skill starts in `exports.handler`, routes Alexa requests by request type, and
then dispatches supported intents:

- `DiceRollSize` rolls a specific die based on the `DiceType` slot.
- `DiceRoll` catches incomplete requests and asks the user which die to roll.
- `AMAZON.HelpIntent` repeats the welcome/help prompt.
- `AMAZON.StopIntent` and `AMAZON.CancelIntent` end the session.

The dice logic normalizes common spoken forms such as `d twenty`, `20`, and
`twenty sided`, then uses `Math.random()` to choose a number in the die range.
Responses are returned as SSML so the skill can include speech formatting and an
optional dice-roll sound effect.

## Adapting This Sample

This repo reflects the Alexa Skills Kit style used when the skill was first
published. If you use it as a starting point today, treat it as a compact
learning sample and expect to update a few pieces for a modern production skill:

1. Create a custom Alexa skill in the Alexa Developer Console.
2. Add the intents, slot type, slot values, and sample utterances from
   `schemas.js` to your interaction model.
3. Deploy `DungeonDice.js` as the Lambda handler for the skill.
4. Replace `[YOURHOSTPATH]/dicesound.mp3` with your own HTTPS-hosted audio file,
   or remove the audio tag from `diceSound`.
5. Add your Alexa skill application ID in the validation block near the top of
   `DungeonDice.js`.
6. Test the skill with utterances such as "roll a D20" and "roll a 6".

For a modern rebuild, you may also want to migrate the handler to the current
Alexa Skills Kit SDK for Node.js and store the interaction model as JSON.

## License

Copyright 2018 DaveDev Productions

Licensed under the Apache License, Version 2.0. You may obtain a copy of the
license at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed
under the license is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the license for the
specific language governing permissions and limitations under the license.
