## ADDED Requirements

### Requirement: EventSource SHALL have a stop() method that cancels the heartbeat timeout

The EventSource class MUST expose a `stop()` method that cancels any pending heartbeat timeout scheduled by the internal `heartbeat()` function.

#### Scenario: stop() cancels active heartbeat

- **WHEN** an EventSource is initialized with `ms > 0` (enabling heartbeat)
- **THEN** calling `stop()` MUST clear the pending heartbeat timeout so no further ping events are emitted

#### Scenario: stop() on instance without heartbeat is a no-op

- **WHEN** an EventSource is initialized with `ms === 0` (heartbeat disabled by default)
- **THEN** calling `stop()` MUST complete without error and emit no events

#### Scenario: stop() returns the EventSource instance

- **WHEN** `stop()` is called on any EventSource instance
- **THEN** the method MUST return `this` (the EventSource instance) for method chaining

#### Scenario: repeated stop() calls are safe

- **WHEN** `stop()` is called multiple times in succession
- **THEN** no errors MUST be thrown and the heartbeat MUST remain cancelled
