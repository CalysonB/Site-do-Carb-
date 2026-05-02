# Specs: Frontend Full Coverage

## Requirements

### R1: Total Coverage
- ALL `.jsx` files in `src/` and `src/components/` MUST reach 100% line coverage.
- ALL `.jsx` files MUST reach at least 90% branch coverage (100% preferred).

### R2: Interaction Testing
- Tests MUST simulate user input (typing in forms, clicking buttons).
- Tests MUST verify loading states and error handling for API calls.

### R3: Navigation Testing
- Tests MUST verify that sidebar links and internal routing logic work correctly.

## Scenarios

### Scenario: Submitting a Suggestion
- **Given** I am on the Ouvidoria component.
- **When** I type a message and click "Enviar".
- **Then** the API MUST be called with the correct data.
- **And** a success message MUST be displayed.
