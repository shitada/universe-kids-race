import { describe, expect, it } from 'vitest';
import { MonthlyEncounterEntity } from '../../../src/game/entities/MonthlyEncounterEntity';
import { MonthlyEncounterSystem } from '../../../src/game/systems/MonthlyEncounterSystem';

describe('MonthlyEncounterSystem', () => {
  it('spawns the encounter configured for the current month', () => {
    const randomValues = [0.1, 0.2, 0.3, 0.4, 0.2];
    const system = new MonthlyEncounterSystem(
      {
        attemptInterval: 1,
        spawnChance: 1,
        introGraceSeconds: 0,
        spawnAheadDistance: 90,
      },
      () => randomValues.shift() ?? 0,
      () => new Date('2026-01-15T09:00:00Z'),
    );

    const result = system.update(1, 12);

    expect(result.newMonthlyEncounters).toHaveLength(1);
    expect(result.newMonthlyEncounters[0]?.encounterId).toBe('new-year-comet');
    expect(result.newMonthlyEncounters[0]?.position.z).toBeLessThan(12);
  });

  it('does not spawn when the chance roll fails', () => {
    const system = new MonthlyEncounterSystem(
      {
        attemptInterval: 1,
        spawnChance: 0.04,
        introGraceSeconds: 0,
      },
      () => 0.8,
      () => new Date('2026-07-01T09:00:00Z'),
    );

    const result = system.update(1, 0);

    expect(result.newMonthlyEncounters).toHaveLength(0);
  });

  it('skips spawning while another monthly encounter is active', () => {
    const system = new MonthlyEncounterSystem(
      {
        attemptInterval: 1,
        spawnChance: 1,
        introGraceSeconds: 0,
      },
      () => 0,
      () => new Date('2026-12-01T09:00:00Z'),
    );
    const activeEncounter = new MonthlyEncounterEntity(0, 0, -20, 'geminid-rain', 1);

    const result = system.update(1, 0, [activeEncounter]);

    expect(result.newMonthlyEncounters).toHaveLength(0);
  });
});
