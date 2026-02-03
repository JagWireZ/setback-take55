[ ] 2.1 Define canonical game state shape
      [ ] 2.1.1 Top-level fields
                - gameId
                - phase
                - players
                - cards
                - scores
                - history
                - options
                - metadata
      [ ] 2.1.2 Player object fields
                - playerId
                - name
                - seat
                - isAI
                - connected

                - hand
                - bid
                - trip
                - books
                - score
                - rainbowEligible
      [x] 2.1.3 Deck + discard + trump representation
      [x] 2.1.4 Trick structure (cards played, leader, winner)
      [x] 2.1.5 Options (maxCards, blindBid, etc.)
      [x] 2.1.6 Metadata (version, timestamps, etc.)

[x] 2.2 Define PHASES enum
      [ ] 2.2.1 Lobby
      [ ] 2.2.2 Dealing
      [ ] 2.2.3 Bidding
      [ ] 2.2.4 Playing
      [ ] 2.2.5 Scoring
      [ ] 2.2.6 GameOver

[x] 2.3 Define STEP enum (optional per-phase substeps)
      [ ] 2.3.1 Dealing steps (shuffle, deal, reveal trump)
      [ ] 2.3.2 Bidding steps (per-player turn)
      [ ] 2.3.3 Playing steps (per-card turn)
      [ ] 2.3.4 Scoring steps (apply bonuses, update totals)

[ ] 2.4 Define all backend actions
      [x] 2.4.1 createGame
      [x] 2.4.2 joinGame
      [x] 2.4.3 startGame
      [x] 2.4.4 submitBid
      [x] 2.4.5 playCard
      [x] 2.4.6 endTrick
      [x] 2.4.7 endRound
      [x] 2.4.8 endGame
      [x] 2.4.9 kickPlayer / replaceWithAI
      [x] 2.4.10 sendEmoji
      [x] 2.4.11 reconnectPlayer

[ ] 2.5 Define action preconditions + validation
      [ ] 2.5.1 Phase validation (action allowed in this phase?)
      [ ] 2.5.2 Turn validation (is it this player’s turn?)
      [ ] 2.5.3 Card legality (follow suit, trump rules)
      [ ] 2.5.4 Bid legality (Trips, min/max)
      [ ] 2.5.5 Seat validation (player belongs to game)
      [ ] 2.5.6 Game not finished

[ ] 2.6 Build deterministic reducer
      [ ] 2.6.1 Pure function: (state, action) → newState
      [ ] 2.6.2 No randomness inside reducer
      [ ] 2.6.3 No side effects
      [ ] 2.6.4 Version increment per action
      [ ] 2.6.5 Error handling (return error, not mutated state)

[ ] 2.7 Implement phase transitions
      [ ] 2.7.1 Lobby → Dealing
      [ ] 2.7.2 Dealing → Bidding
      [ ] 2.7.3 Bidding → Playing
      [ ] 2.7.4 Playing → Scoring
      [ ] 2.7.5 Scoring → Next Round or GameOver

[ ] 2.8 Implement round logic
      [ ] 2.8.1 Determine card count for round
      [ ] 2.8.2 Determine dealer
      [ ] 2.8.3 Determine bidding order
      [ ] 2.8.4 Determine trick leader
      [ ] 2.8.5 Determine next round or end game

[ ] 2.9 Implement scoring logic
      [ ] 2.9.1 Standard scoring
      [ ] 2.9.2 Rainbow bonus
      [ ] 2.9.3 Trip scoring
      [ ] 2.9.4 Update totalScore + possibleScore

[ ] 2.10 Implement AI integration
      [ ] 2.10.1 Define cleanState shape
      [ ] 2.10.2 Lambda invocation contract
      [ ] 2.10.3 Deterministic bidding strategy
      [ ] 2.10.4 Deterministic card selection strategy
      [ ] 2.10.5 Error handling for AI failures

[ ] 2.11 Implement logging hooks
      [ ] 2.11.1 Log action
      [ ] 2.11.2 Log state transition
      [ ] 2.11.3 Log errors
      [ ] 2.11.4 Log AI decisions

[ ] 2.12 Write integration tests
      [ ] 2.12.1 Full game simulation (AI only)
      [ ] 2.12.2 Human + AI mixed simulation
      [ ] 2.12.3 Edge cases (Trips, jokers, rainbow)
      [ ] 2.12.4 Invalid actions (wrong turn, illegal card)
      [ ] 2.12.5 Reconnect flow

[ ] 2.13 Finalize engine API for frontend
      [ ] 2.13.1 Input/output shapes
      [ ] 2.13.2 Error codes
      [ ] 2.13.3 Action endpoints
      [ ] 2.13.4 State polling or subscription model
