import { describe, it, expect } from 'vitest';
import { SPECIALTIES, SPECIALTY_MAP } from '../constants';

describe('SPECIALTIES', () => {
  it('has 9 entries', () => {
    expect(SPECIALTIES).toHaveLength(9);
  });

  it('each entry has value, label, and icon', () => {
    for (const entry of SPECIALTIES) {
      expect(entry).toHaveProperty('value');
      expect(entry).toHaveProperty('label');
      expect(entry).toHaveProperty('icon');
      expect(typeof entry.value).toBe('string');
      expect(typeof entry.label).toBe('string');
      expect(typeof entry.icon).toBe('string');
    }
  });

  it('contains expected specialties', () => {
    const values = SPECIALTIES.map((s) => s.value);
    expect(values).toContain('plomeria');
    expect(values).toContain('electricidad');
    expect(values).toContain('gas');
    expect(values).toContain('pintura');
    expect(values).toContain('herreria');
    expect(values).toContain('carpinteria');
    expect(values).toContain('jardineria');
    expect(values).toContain('climatizacion');
    expect(values).toContain('otros');
  });
});

describe('SPECIALTY_MAP', () => {
  it('has correct mapping for plomeria', () => {
    expect(SPECIALTY_MAP['plomeria']).toBe('Plomería');
  });

  it('has correct mapping for electricidad', () => {
    expect(SPECIALTY_MAP['electricidad']).toBe('Electricidad');
  });

  it('has correct mapping for gas', () => {
    expect(SPECIALTY_MAP['gas']).toBe('Gas');
  });

  it('has correct mapping for pintura', () => {
    expect(SPECIALTY_MAP['pintura']).toBe('Pintura');
  });

  it('has correct mapping for herreria', () => {
    expect(SPECIALTY_MAP['herreria']).toBe('Herrería');
  });

  it('has correct mapping for carpinteria', () => {
    expect(SPECIALTY_MAP['carpinteria']).toBe('Carpintería');
  });

  it('has correct mapping for jardineria', () => {
    expect(SPECIALTY_MAP['jardineria']).toBe('Jardinería');
  });

  it('has correct mapping for climatizacion', () => {
    expect(SPECIALTY_MAP['climatizacion']).toBe('Climatización');
  });

  it('has correct mapping for otros', () => {
    expect(SPECIALTY_MAP['otros']).toBe('Otros');
  });

  it('maps every specialty in SPECIALTIES', () => {
    for (const entry of SPECIALTIES) {
      expect(SPECIALTY_MAP[entry.value]).toBe(entry.label);
    }
  });
});
