import { describe, expect, it } from 'vitest';
import { DATA_SCOPES } from './authorization.js';

describe('DATA_SCOPES', () => {
  it('contient exactement les scopes du prompt maître §8', () => {
    expect([...DATA_SCOPES]).toEqual([
      'ALL',
      'ASSIGNED_CLASSES',
      'ASSIGNED_SUBJECTS',
      'OWN_CHILDREN',
      'OWN_DATA',
    ]);
  });
});
