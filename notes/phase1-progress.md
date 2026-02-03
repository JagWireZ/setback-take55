1. Concept & Domain Definition

1.1 Clarify app purpose
[✓] 1.1.1 This application presents a fun card game, called Set Back, where up to five players take turns bidding how many books they think they'll win and playing a set number of tricks for each round.
[✓] 1.1.2 Each user has the following functions:
          - creator: creates a game, sets options, starts the game, ends the game
          - non‑creator: joins the game by link from the creator
          - dealer: rotates each round; shuffles, deals, and reveals the trump card
          - all players:
              • bid a number of books they think they'll win after the trump is revealed  
                (or optionally before — Blind Bidding)
              • play tricks in a defined order (to be defined later)
              • winner of each trick collects the book
[✓] 1.1.3 For a fun game experience for 1–5 people, who can play against each other or against AI depending on how many human players join.
[✓] 1.1.4 There are other games known as Set Back or Pitch, but none match this variant’s rules.  
          (We may eventually create a unique name for this version.)
[✓] 1.1.5 Serverless architecture: Lambda handles the engine and logic; DynamoDB maintains the state.

1.2 Identify primary users

[✓] 1.2.1 List all user types (creators, joiners, solo players, AI players)
          - creator
          - joiner
          - solo (creator with no joiners)
          - AI (fills empty seats up to 5 total players)

[✓] 1.2.2 Describe each user’s goals
          - Goal is to win the game by earning the highest points
          - Goal is to set other players back by preventing them from winning all the books they bid

[✓] 1.2.3 Describe each user’s frustrations or needs
          - N/A (no additional frustrations or needs identified yet)

[✓] 1.2.4 Identify what each user must do to participate
          - Enter their name
          - Enter the maximum cards per round (creator only; default 10)
          - Enter the game ID to join (joiners only)
          - Enter a bid each round
          - Select a card to play for each trick

[✓] 1.2.5 Identify what each user must not have to do
          - No sign‑ups required
          - Each player receives a playerToken (UUID) valid only for the active game

1.3 Define user flows
[✓] 1.3.1 Write the Create Game flow step‑by‑step
        - 1. User clicks "New Game"
        - 2. User is prompted for playerName and maxCards
        - 3. User clicks "Create Game"
        - 4. A new game state with a fun gameId is generated from a template
        - 5. A new player is created with {playerId, playerName, playerToken, seat: 0}
        - 6. The player is added to the game state (playerToken is NOT stored in the state)
        - 7. A new table item is created under the gameId containing:
              • game state (phase = LOBBY)
              • playerTokens: [{ playerId: playerToken }]
              • ownerToken: creator’s token
              • authorizedToken: creator’s token (their turn by default)
              • version: 1
        - 8. User receives { state, playerId, playerToken } in the response
        - 9. Client navigates to the lobby page, showing:
              • gameId
              • invite link
              • four empty seats
              • “Start Game” button (creator only)
[✓] 1.3.2 Write the Join Game flow step‑by‑step
        - 1. User visits link https://<domain>/game/<gameId>
        - 2. User is prompted for playerName
        - 3. User clicks "Join Game"
        - 4. A new player is created with:
              { playerId, playerName, playerToken, seat: next available seat }
        - 5. The table item is updated accordingly and the version is incremented
        - 6. User receives { state, playerId, playerToken } in the response
        - 7. Client navigates to the lobby page, identical to the creator’s view
              except without the “Start Game” button
[✓] 1.3.3 Write the Lobby flow (waiting, player list, start game)
        - 1. User lands in the lobby
        - 2. Users can see all joined players or empty seats
              • empty seats will be filled by AI when the creator starts the game
        - 3. Only the creator sees the “Start Game” button
              • only the creator can invoke the startGame action
[✓] 1.3.4 Write the Gameplay flow (turns, actions, scoring)
        - 1. LOBBY
        - 2. START GAME
              • Repeat the following phases for each round:
                    a. DEALING
                    b. BIDDING
                    c. PLAYING
                    d. SCORING
        - 3. END GAME
[✓] 1.3.5 Write the End Game flow (results, replay options)
        - 1. Display final results to all players
        - 2. Provide an option to restart the game with the same players
[ ] 1.3.6 Identify edge cases (disconnects, rejoining, full game)
        - 1.3.6.1 Joining & lobby edge cases
        - 1.3.6.2 Disconnection & reconnection edge cases
        - 1.3.6.3 Turn order & action timing edge cases
        - 1.3.6.4 State version conflict edge cases
        - 1.3.6.5 AI behavior edge cases
        - 1.3.6.6 Round & scoring edge cases
        - 1.3.6.7 End game edge cases
[✓] 1.4.1 List all core objects
        - Game
        - Player
        - Phase
        - Round
        - Trick
        - Table
        - Deck
        - Card
        - Hand
        - Trump
        - Book
        - Score
[✓] 1.4.2 Define each object in plain language
        - Game: holds the gameId, game options, and rules that govern gameplay
        - Player: contains playerId, playerToken (private), playerName, and seat assignment
        - Phase: represents the current stage of the game (lobby, dealing, bidding, playing)
        - Round: identifies the round (roundId) and the number of cards dealt for that round
        - Trick: represents a single trick within a round; may include trickIndex if needed
        - Table: the cards currently played on the table for the active trick
        - Deck: defines every card in the deck (full card list for the game)
        - Trump: defines the current trump card for the round
        - Hand: the set of cards held by each player
        - Book: all cards played in a completed trick, moved to the winner of that trick
        - Score: includes totalScore and possibleScore for each player
[✓] 1.4.3 Identify which objects are persistent (stored in DB)
        - All objects except Deck are persisted in DynamoDB
              • Game
              • Player
              • Phase
              • Round
              • Trick
              • Table
              • Card (as part of hands, books, table, etc.)
              • Hand
              • Trump
              • Book
              • Score
        - Deck is NOT persisted; it is defined in code and generated as needed
[✓] 1.4.4 Identify which objects are ephemeral (computed on the fly)
        - Deck: generated in code as needed and never stored in the database
[✓] 1.4.5 Describe relationships between objects
        - A Game contains:
              • Players
              • Rounds
              • Current Phase
              • Trump
              • Score objects (one per player)
              • Table (current trick’s played cards)

        - A Round contains:
              • A number of cards (round size)
              • A sequence of Tricks
              • A Trump card (for that round)
              • Each Player’s Hand at the start of the round

        - A Trick contains:
              • Cards played on the Table
              • A winner (playerId)
              • A resulting Book (collected by the winner)

        - A Player contains:
              • playerId, playerName, seat
              • playerToken (private)
              • Hand (cards currently held)
              • Score (totalScore, possibleScore)
              • Books won (across tricks)

        - A Table contains:
              • The cards currently played for the active Trick
              • One card per active player (or AI)

        - A Book contains:
              • All cards from a completed Trick
              • A reference to the winning player

        - A Deck:
              • Exists only in code
              • Is used to generate Hands and deal cards

        - Trump:
              • Belongs to the Round
              • Influences Trick resolution
[✓] 1.5.1 List all core player interactions
        - shuffleCards: performed only by the dealer for the round
        - dealCards: performed only by the dealer for the round
        - revealTrump: performed only by the dealer for the round
        - submitBid: includes passing and tripping (when allowed)
        - playCard: used during the PLAYING phase to play a card from hand
        - declareRainbow: optional declaration during bidding for specific rounds only
        - sendEmoji: allows players to send fun reactions to others
[✓] 1.5.2 Define each interaction in plain language
        - shuffleCards: the deck is randomly re‑organized by the dealer

        - dealCards: starting with the player after the dealer, deal one card at a time
              • continue dealing in rotation until each player has the correct number of cards
              • this uses the shuffled deck generated in code

        - revealTrump: after dealing, the next card in the deck is turned face‑up
              • this card becomes the Trump card for the round
              • all players can see it

        - submitBid: starting with the player after the dealer, each player submits a bid
              • bid represents how many books they predict they will win
              • passing and tripping are included in this action

        - playCard: the active player selects a card from their hand to place on the table
              • contributes to the current trick

        - declareRainbow: removed as a player action
              • this will be automated for rounds with 4 cards

        - sendEmoji: player selects an emoji to display to other players for fun
[✓] 1.5.3 Describe the sequence of interactions within each round

        - Dealing phase (dealer only):
              1. shuffleCards — dealer randomizes the deck
              2. dealCards — dealer distributes cards one at a time in seat order
              3. revealTrump — dealer flips the next card to establish trump

        - Bidding phase:
              • Each player submits a bid (or passes/trips)
              • Order begins with the player after the dealer
              • Continues clockwise until all players have bid

        - Playing phase:
              • Each player plays one card per trick
              • First lead is the player with the highest bid for the round
              • Subsequent leads are the winners of each trick
              • Turn order always proceeds clockwise

        - Post‑round phase:
              • Winner of each trick receives the Book (all cards from the table)
              • After the final trick, scoring is applied for the round
[✓] 1.5.4 Define how the number of rounds is determined
        - The creator selects a maximum number of cards for the game (default: 10)
        - The round sequence always follows a “down then up” pattern:
              • Starts at maxCards
              • Decreases by 1 each round until reaching 1
              • Increases by 1 each round until returning to maxCards
        - Example:
              • maxCards = 10 → rounds: 10 → 1 → 10 (19 rounds)
              • maxCards = 5  → rounds: 5 → 1 → 5  (9 rounds)
        - This sequence determines:
              • Number of rounds in the game
              • Number of cards dealt in each round
              • The structure of the dealing, bidding, and playing phases
[✓] 1.5.5 Define scoring rules applied after each round

        - Standard scoring:
              • +10 points per bid if total books ≥ bid
                    - Example: bid 3 and win 3+ books → +30 points
              • +1 point for each book above the bid
                    - Example: bid 3 and win 5 books → +2 points
              • -10 points per bid if total books < bid
                    - Example: bid 3 and win 2 or fewer → -30 points

        - Rainbow round bonus (rounds that start with 4 cards):
              • +25 points if a player is dealt one card of each suit
              • Joker cards count as the trump suit for rainbow detection

        - Trip round scoring (rounds with 3, 2, or 1 card):
              • If a player “Trips” and wins all books:
                    - +30 points per book
                    - Example: trip on 3‑card round and win all 3 → +90 points
              • If a player “Trips” and fails to win all books:
                    - -30 points per bid
                    - Example: trip on 3‑card round and win only 2 → -90 points

        - Score tracking:
              • totalScore: cumulative points earned across all rounds
              • possibleScore: points the player *could* have earned
                    - Calculated as if they had bid exactly the number of books they actually won each round
[ ] 1.5.7 Define additional interactions as needed
        - Placeholder for interactions that will be clarified during deeper design
        - These will be added once we dig into each phase and object in detail
[✓] 1.6.1 Maximum players
        - The game supports up to 5 total players
        - Seats are fixed and indexed (0–4)

[✓] 1.6.2 AI fills empty seats
        - When the creator starts the game, any empty seats are filled with AI players
        - AI players are assigned deterministic seats after all humans are seated

[✓] 1.6.3 Players can rejoin
        - Human players may disconnect and reconnect during the game
        - Rejoining restores their seat, hand, and state
        - AI may temporarily take over if desired (future option)
[✓] 1.6.4 Game state must be fully deterministic
        - The game state represents only the current facts of a single game:
              • gameId and creator‑selected options
              • players and seats
              • current round, phase, and turn
              • hands, table, books, trump, and bids
              • scoring (total and possible)
        - The state contains no rules, randomness, or hidden logic
        - All randomness occurs only once during shuffleCards
        - Every state transition is produced by the engine as a pure function:
              nextState = reducer(currentState, action)
        - Given the same initial state and the same sequence of actions,
          the engine must always produce the same resulting state
        - This ensures replayability, debugging, reconnection safety,
          serverless consistency, and anti‑cheat integrity
[✓] 1.6.5 Timeouts and inactivity behavior
        - The game does not enforce connection‑based timeouts
              • Players may disconnect at any time without penalty
              • The game state remains intact indefinitely

        - The game may be paused and resumed later
              • A paused game simply remains in its current state
              • Players can rejoin and continue from the exact point of interruption
              • No automatic progression occurs during inactivity

        - The creator may remove an inactive or unwanted player
              • Kicked player is immediately replaced by an AI occupying the same seat
              • AI inherits the player’s hand, bid, and turn responsibilities
              • This action is only available before or during gameplay, not after game end
[✓] 1.6.6 Serverless limitations
        - No special constraints expected for this project size
        - Lambda cold starts, payload limits, and execution time are not concerns
        - Standard best practices will be sufficient

[✓] 1.6.7 DynamoDB constraints
        - Game state fits well within DynamoDB item size limits
        - Access patterns are simple and predictable (one item per game)
        - No advanced partitioning or optimization required for MVP
[✓] 1.7.1 Core gameplay features
        - Create a new game with selected options (maxCards, etc.)
        - Join an existing game by gameId
        - Fill empty seats with AI players at game start

        - Initialize gameplay for each round:
              • Shuffle the deck deterministically
              • Deal cards based on the round’s card count
              • Reveal the trump card

        - Bidding phase:
              • Enforce bidding order (player after dealer → clockwise)
              • Validate bids (including Trips)
              • Store each player’s bid

        - Playing phase:
              • Determine who leads the first trick (highest bid)
              • Enforce turn order (clockwise)
              • Validate card plays (follow suit, trump rules, etc.)
              • Resolve each trick and award the book
              • Determine who leads the next trick (trick winner)

        - Round progression:
              • Track number of tricks played
              • Track books won per player
              • Transition to scoring when all tricks are complete

        - Scoring:
              • Apply standard scoring
              • Apply Rainbow bonus
              • Apply Trip scoring
              • Update totalScore and possibleScore

        - Game flow:
              • Advance to the next round (down → 1 → up)
              • Detect final round completion
              • Produce final results and end the game
[ ] 1.7.2 Lobby features
        Creator:
              • Sets game options (maxCards, etc.)
              • Starts the game when ready
              • Can kick a player (replaced by AI)
              • Can rename the game (optional but common)

        All players:
              • Join the lobby using a gameId
              • See who else is in the lobby
              • See which seats are filled (human or AI)
              • Change their displayed name before the game starts
              • Send emojis to the lobby
              • Leave the lobby before the game starts

        System behavior:
              • Lobby updates in real time as players join/leave
              • Game cannot start until at least 1 human is present
              • Once the game starts, lobby transitions to gameplay state
[ ] 1.7.3 Game creation and joining
        - Create a new game with a unique gameId (adjective_animal)
        - Creator selects game options (maxCards, blindBid, etc.)
        - Creator receives a join link or code (gameId)
        - Players can join an existing game using the gameId
        - Validate that the game is joinable (not started, not full)
        - Assign each joining player to an available seat
        - Show current lobby state to all connected players
        - Allow players to leave before the game starts
        - Replace empty seats with AI when the creator starts the game
        - Transition from lobby → gameplay when the creator starts the game
[ ] 1.7.4 AI player support
        - AI can fill empty seats at game start
        - AI inherits a kicked player’s seat, hand, and responsibilities
        - AI participates in all phases:
              • Bidding (simple, deterministic strategy)
              • Playing cards (always plays a legal card)
              • Following suit and trump rules correctly
        - AI decisions must be deterministic given the current state
        - AI runs as its own Lambda function and receives a cleanState
              • cleanState hides the deck and all other players’ hands
              • AI only sees information a human in that seat would see
        - AI must act instantly (no delays or animations)
        - AI must be able to complete a full game with humans or other AIs
[ ] 1.7.5 Basic UI components
        - Table
              • Full-screen poker‑green background
              • Central area for cards played in the current trick

        - Player hand
              • Shows the player’s cards
              • Cards are sortable and tappable/clickable

        - Deck
              • Shows undealt or unflipped cards remaining
              • Only visible during dealing phase

        - Trump display
              • Shows the flipped trump card
              • If a joker is flipped, overlap with the next card (jokers cannot be trump)

        - Other players’ hands
              • Show card backs only
              • Display count (2, 3, 4 cards left, etc.)

        - Books
              • Grouping of tricks won per player
              • If space is limited, show numeric count instead of card piles

        - Action buttons
              • Bid controls
              • Play card confirmation (if needed)
              • Emoji reactions
              • Leave game / settings

        - Turn + phase indicators
              • Whose turn it is
              • Current phase (bidding, playing, scoring)
              • Round number and card count

        - Scoreboard (minimal)
              • TotalScore and possibleScore
              • Updated after each round

        - Connection / seat indicators
              • Human vs AI
              • Reconnected / disconnected status (simple icon)
[✓] 1.7.6 Error handling and validation
        - Will be defined action-by-action during implementation
        - Each action will specify:
              • Preconditions (phase, turn, seat, etc.)
              • Validation rules (legal bids, legal card plays, etc.)
              • Error responses for invalid actions
        - Engine will enforce deterministic, rule-based transitions
        - UI will surface errors minimally and clearly
[ ] 1.7.7 Minimal analytics or logging
        - Log every game action with:
              • gameId
              • playerId (or AI)
              • action type
              • action payload (sanitized)
              • timestamp
        - Log state transitions for debugging:
              • previousState.version
              • nextState.version
              • phase/round changes
        - Log errors and invalid actions for diagnostics
        - Log AI decisions (action + reasoning summary)
        - Store logs in a lightweight, append-only format
        - No analytics dashboards or aggregation required for MVP
[ ] 1.7.8 Anything required for MVP (no extras)
        - Only features necessary to play a full game from start to finish
        - No animations, cosmetics, themes, or advanced UI polish
        - No social features beyond basic emojis
        - No advanced AI logic (legal, deterministic play only)
        - No persistence beyond active games (no history, no profiles)
        - No matchmaking or public lobbies (invite-only via gameId)
        - No analytics dashboards or metrics aggregation
        - No sound effects, tutorials, or onboarding flows
        - No cross‑game chat or friend system
        - No device‑specific optimizations or offline mode
