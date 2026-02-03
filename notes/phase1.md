1. Concept & Domain Definition

[x] 1.1 Clarify app purpose
  [x] 1.1.1 Write a one‑sentence description of the app
  [x] 1.1.2 Define the core experience (what users actually do)
  [x] 1.1.3 State why the app exists (the problem it solves)
  [x] 1.1.4 Identify the unique value (why this version is better/easier)
  [x] 1.1.5 Define the constraints (serverless, low cost, no accounts)

[x] 1.2 Identify primary users
  [x] 1.2.1 List all user types (creators, joiners, solo players, AI players)
  [x] 1.2.2 Describe each user’s goals
  [x] 1.2.3 Describe each user’s frustrations or needs
  [x] 1.2.4 Identify what each user must do to participate
  [x] 1.2.5 Identify what each user must not have to do (e.g., no signup)

[ ] 1.3 Define user flows
  [x] 1.3.1 Write the Create Game flow step‑by‑step
  [x] 1.3.2 Write the Join Game flow step‑by‑step
  [x] 1.3.3 Write the Lobby flow (waiting, player list, start game)
  [x] 1.3.4 Write the Gameplay flow (turns, actions, scoring)
  [x] 1.3.5 Write the End Game flow (results, replay options)
  [x] 1.3.6 Identify any edge cases (disconnects, rejoining, full game)

[ ] 1.4 Establish domain concepts
  [x] 1.4.1 List all core objects (Game, Player, Card, Hand, Round, Turn, etc.)
  [x] 1.4.2 Define each object in plain language
  [x] 1.4.3 Identify which objects are persistent (stored in DB)
  [x] 1.4.4 Identify which objects are ephemeral (computed on the fly)
  [x] 1.4.5 Identify relationships between objects (e.g., Game → Players)

[ ] 1.5 Define core interactions
  [x] 1.5.1 List all actions a player can take (create, join, play card, pass, etc.)
  [x] 1.5.2 Define what happens when each action occurs
  [x] 1.5.3 Define turn order rules
  [x] 1.5.4 Define how rounds progress
  [x] 1.5.5 Define how scoring works
  [x] 1.5.6 Define how the game ends
  [ ] 1.5.7 Identify invalid actions and how they are handled

[ ] 1.6 Identify constraints and assumptions
  [x] 1.6.1 Max number of players (5 total seats)
  [x] 1.6.2 AI fills empty seats at game start
  [x] 1.6.3 Players can rejoin after disconnect
  [x] 1.6.4 Game state must be fully deterministic
  [x] 1.6.5 Timeouts and inactivity behavior (per phase and per action)
  [x] 1.6.6 Serverless constraints (cold starts, payload limits, execution time)
  [x] 1.6.7 DynamoDB constraints (item size, partition key, access patterns)

[ ] 1.7 Draft initial feature list
  [x] 1.7.1 Core gameplay features
  [x] 1.7.2 Lobby features
  [x] 1.7.3 Game creation and joining
  [x] 1.7.4 AI player support
  [x] 1.7.5 Basic UI components
  [x] 1.7.6 Error handling and validation
  [x] 1.7.7 Minimal analytics or logging
  [x] 1.7.8 Anything required for MVP (no extras)

[ ] 1.8 Determine success criteria
  [ ] 1.8.1 Define what “MVP playable” means
  [ ] 1.8.2 Define what “game is stable” means
  [ ] 1.8.3 Define what “user experience is acceptable” means
  [ ] 1.8.4 Define what “backend is reliable” means
  [ ] 1.8.5 Define what “launch‑ready” means

[ ] 1.9 Validate scope
  [ ] 1.9.1 Review all features and remove anything non‑essential
  [ ] 1.9.2 Confirm the project fits your timeline
  [ ] 1.9.3 Confirm the project fits your energy and resources
  [ ] 1.9.4 Identify any risks or unknowns
  [ ] 1.9.5 Decide what can be postponed to Phase 2+
