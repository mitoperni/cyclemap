import { describe, it, expect } from 'vitest';
import { cleanStationName } from '../utils';

describe('cleanStationName', () => {
  describe('removes numeric prefixes with dash separator', () => {
    it('should clean "30 - San Quintín" → "San Quintín"', () => {
      expect(cleanStationName('30 - San Quintín')).toBe('San Quintín');
    });

    it('should clean "377 - Metro Abrantes" → "Metro Abrantes"', () => {
      expect(cleanStationName('377 - Metro Abrantes')).toBe('Metro Abrantes');
    });

    it('should clean "1 - Primera Estación" → "Primera Estación"', () => {
      expect(cleanStationName('1 - Primera Estación')).toBe('Primera Estación');
    });
  });

  describe('removes numeric prefixes with dot separator', () => {
    it('should clean "04. Municipio" → "Municipio"', () => {
      expect(cleanStationName('04. Municipio')).toBe('Municipio');
    });

    it('should clean "1. Station Name" → "Station Name"', () => {
      expect(cleanStationName('1. Station Name')).toBe('Station Name');
    });

    it('should clean "99.Test" → "Test"', () => {
      expect(cleanStationName('99.Test')).toBe('Test');
    });
  });

  describe('removes numeric prefixes with space only', () => {
    it('should clean "42 Station" → "Station"', () => {
      expect(cleanStationName('42 Station')).toBe('Station');
    });

    it('should clean "7  Double Space" → "Double Space"', () => {
      expect(cleanStationName('7  Double Space')).toBe('Double Space');
    });
  });

  describe('preserves names without numeric prefix', () => {
    it('should keep "Plaza Mayor" unchanged', () => {
      expect(cleanStationName('Plaza Mayor')).toBe('Plaza Mayor');
    });

    it('should keep "Estación Central" unchanged', () => {
      expect(cleanStationName('Estación Central')).toBe('Estación Central');
    });

    it('should keep names with numbers in the middle', () => {
      expect(cleanStationName('Calle 42 Norte')).toBe('Calle 42 Norte');
    });

    it('should keep names ending with numbers', () => {
      expect(cleanStationName('Terminal 3')).toBe('Terminal 3');
    });
  });

  describe('removes short code prefixes', () => {
    it('should clean "AUH - Marina Mall Signal" → "Marina Mall Signal"', () => {
      expect(cleanStationName('AUH - Marina Mall Signal')).toBe('Marina Mall Signal');
    });

    it('should clean "NYC - Central Park" → "Central Park"', () => {
      expect(cleanStationName('NYC - Central Park')).toBe('Central Park');
    });

    it('should clean "AB - Short Code" → "Short Code"', () => {
      expect(cleanStationName('AB - Short Code')).toBe('Short Code');
    });

    it('should clean "ABCD - Four Letter Code" → "Four Letter Code"', () => {
      expect(cleanStationName('ABCD - Four Letter Code')).toBe('Four Letter Code');
    });

    it('should not remove longer prefixes like "ABCDE - Station"', () => {
      expect(cleanStationName('ABCDE - Station')).toBe('ABCDE - Station');
    });
  });

  describe('handles underscore prefix with ALL CAPS', () => {
    it('should clean "_CALLE LAS LEANDRAS" → "Calle Las Leandras"', () => {
      expect(cleanStationName('_CALLE LAS LEANDRAS')).toBe('Calle Las Leandras');
    });

    it('should clean "__DOUBLE UNDERSCORE" → "Double Underscore"', () => {
      expect(cleanStationName('__DOUBLE UNDERSCORE')).toBe('Double Underscore');
    });

    it('should clean "_PLAZA MAYOR" → "Plaza Mayor"', () => {
      expect(cleanStationName('_PLAZA MAYOR')).toBe('Plaza Mayor');
    });

    it('should remove underscore but keep mixed case as-is', () => {
      expect(cleanStationName('_Already Mixed Case')).toBe('Already Mixed Case');
    });

    it('should handle accented characters correctly', () => {
      expect(cleanStationName('_CALLE JOSÉ MARÍA MORENO GALVÁN')).toBe(
        'Calle José María Moreno Galván'
      );
    });
  });

  describe('edge cases', () => {
    it('should trim whitespace from result', () => {
      expect(cleanStationName('  Station Name  ')).toBe('Station Name');
    });

    it('should handle empty string', () => {
      expect(cleanStationName('')).toBe('');
    });

    it('should handle string with only numbers', () => {
      expect(cleanStationName('123')).toBe('123');
    });

    it('should handle number followed by dash but no name', () => {
      expect(cleanStationName('42 - ')).toBe('');
    });

    it('should not remove single letter at the start', () => {
      expect(cleanStationName('A - Station')).toBe('A - Station');
    });

    it('should handle multiple dashes in name', () => {
      expect(cleanStationName('10 - San José - Centro')).toBe('San José - Centro');
    });
  });
});
