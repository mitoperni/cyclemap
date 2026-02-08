import { describe, it, expect } from 'vitest';
import { cleanStationName, paginateItems, parsePageParam, getAriaSort } from '../utils';

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

    it('should clean "25A - Plaza de Celenque A" (BiciMAD alphanumeric prefix)', () => {
      expect(cleanStationName('25A - Plaza de Celenque A')).toBe('Plaza de Celenque A');
    });

    it('should clean "80B - Estación de Atocha B"', () => {
      expect(cleanStationName('80B - Estación de Atocha B')).toBe('Estación de Atocha B');
    });

    it('should clean "106B - Plaza de Colón B"', () => {
      expect(cleanStationName('106B - Plaza de Colón B')).toBe('Plaza de Colón B');
    });

    it('should clean "111A - Metro Moncloa A"', () => {
      expect(cleanStationName('111A - Metro Moncloa A')).toBe('Metro Moncloa A');
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

    it('should not remove 5+ letter words (not a code prefix)', () => {
      expect(cleanStationName('ABCDE - Station')).toBe('ABCDE - Station');
    });
  });

  describe('handles underscore prefix with ALL CAPS', () => {
    it('should clean "_CALLE LAS LEANDRAS" → "Calle las Leandras"', () => {
      expect(cleanStationName('_CALLE LAS LEANDRAS')).toBe('Calle las Leandras');
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

  describe('Dublin ALL CAPS names (title-cased)', () => {
    it('should title-case "WESTERN WAY" → "Western Way"', () => {
      expect(cleanStationName('WESTERN WAY')).toBe('Western Way');
    });

    it('should title-case "BOLTON STREET" → "Bolton Street"', () => {
      expect(cleanStationName('BOLTON STREET')).toBe('Bolton Street');
    });

    it('should title-case "FITZWILLIAM SQUARE WEST" → "Fitzwilliam Square West"', () => {
      expect(cleanStationName('FITZWILLIAM SQUARE WEST')).toBe('Fitzwilliam Square West');
    });

    it('should title-case "PRINCES STREET / O\'CONNELL STREET"', () => {
      expect(cleanStationName("PRINCES STREET / O'CONNELL STREET")).toBe(
        "Princes Street / O'connell Street"
      );
    });

    it('should title-case "GRANGEGORMAN LOWER (SOUTH)"', () => {
      expect(cleanStationName('GRANGEGORMAN LOWER (SOUTH)')).toBe('Grangegorman Lower (south)');
    });
  });

  describe('Italian particle "di" not confused with roman numeral DI', () => {
    it('should lowercase "di" in "VIA DI ROMA"', () => {
      expect(cleanStationName('VIA DI ROMA')).toBe('Via di Roma');
    });
  });

  describe('León mixed prefix patterns', () => {
    it('should preserve and title-case "PARQUE DE LA PLAZA DE LA UNIÓN EUROPEA"', () => {
      expect(cleanStationName('PARQUE DE LA PLAZA DE LA UNIÓN EUROPEA')).toBe(
        'Parque de la Plaza de la Unión Europea'
      );
    });

    it('should strip numeric prefix from "24 AV. JOSÉ AGUADO"', () => {
      expect(cleanStationName('24 AV. JOSÉ AGUADO')).toBe('Av. José Aguado');
    });

    it('should preserve and title-case "DEMETRIO MONTESERIN - PLAZA DEL HUEVO"', () => {
      expect(cleanStationName('DEMETRIO MONTESERIN - PLAZA DEL HUEVO')).toBe(
        'Demetrio Monteserin - Plaza del Huevo'
      );
    });

    it('should strip numeric prefix from "03 CENTRO CÍVICO EL CRUCERO"', () => {
      expect(cleanStationName('03 CENTRO CÍVICO EL CRUCERO')).toBe('Centro Cívico el Crucero');
    });

    it('should preserve and title-case "REINO DE LEON - ROLLO DE SANTA ANA"', () => {
      expect(cleanStationName('REINO DE LEON - ROLLO DE SANTA ANA')).toBe(
        'Reino de Leon - Rollo de Santa Ana'
      );
    });
  });

  describe('Barcelona station names with street abbreviations', () => {
    it('should preserve "C/ SARDENYA, 178" and title-case', () => {
      expect(cleanStationName('C/ SARDENYA, 178')).toBe('C/ Sardenya, 178');
    });

    it('should preserve "PG. PUJADES, 2" and title-case', () => {
      expect(cleanStationName('PG. PUJADES, 2')).toBe('Pg. Pujades, 2');
    });

    it('should preserve "AV. PARAL.LEL, 54" and title-case', () => {
      expect(cleanStationName('AV. PARAL.LEL, 54')).toBe('Av. Paral.lel, 54');
    });
  });

  describe('Valenbisi underscore-as-separator names', () => {
    it('should convert "_CALLE_JUAN_XXIII" underscores to spaces and title-case', () => {
      expect(cleanStationName('_CALLE_JUAN_XXIII')).toBe('Calle Juan XXIII');
    });

    it('should handle "_AVDA_CID_ANTES_MARCONI"', () => {
      expect(cleanStationName('_AVDA_CID_ANTES_MARCONI')).toBe('Avda Cid Antes Marconi');
    });

    it('should handle mixed underscore and space "_AVDA. CONSTITUCIÓN"', () => {
      expect(cleanStationName('_AVDA. CONSTITUCIÓN')).toBe('Avda. Constitución');
    });

    it('should handle "_CALLE_VALLE_BALLESTERA_ESQ_PLAZA_POLICIA_LOCAL"', () => {
      expect(cleanStationName('_CALLE_VALLE_BALLESTERA_ESQ_PLAZA_POLICIA_LOCAL')).toBe(
        'Calle Valle Ballestera Esq Plaza Policia Local'
      );
    });

    it('should lowercase particles: "_PZA AYTO CON CALLE COTANDA"', () => {
      expect(cleanStationName('_PZA AYTO CON CALLE COTANDA')).toBe('Pza Ayto con Calle Cotanda');
    });

    it('should preserve roman numerals: "_AVDA. DEL PUERTO I"', () => {
      expect(cleanStationName('_AVDA. DEL PUERTO I')).toBe('Avda. del Puerto I');
    });

    it('should preserve roman numerals: "_AVDA. DEL PUERTO II"', () => {
      expect(cleanStationName('_AVDA. DEL PUERTO II')).toBe('Avda. del Puerto II');
    });

    it('should preserve roman numerals: "_AVDA. DEL PUERTO III"', () => {
      expect(cleanStationName('_AVDA. DEL PUERTO III')).toBe('Avda. del Puerto III');
    });
  });

  describe('London large numeric prefixes', () => {
    it('should strip "300073 - " from London station names', () => {
      expect(cleanStationName('300073 - Prince of Wales Drive, Battersea Park')).toBe(
        'Prince of Wales Drive, Battersea Park'
      );
    });
  });

  describe('preserves ordinal prefixes', () => {
    it('should keep "3rd Avenue" unchanged', () => {
      expect(cleanStationName('3rd Avenue')).toBe('3rd Avenue');
    });

    it('should keep "1st Street" unchanged', () => {
      expect(cleanStationName('1st Street')).toBe('1st Street');
    });

    it('should keep "2nd Boulevard" unchanged', () => {
      expect(cleanStationName('2nd Boulevard')).toBe('2nd Boulevard');
    });

    it('should keep "42nd Street" unchanged', () => {
      expect(cleanStationName('42nd Street')).toBe('42nd Street');
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

    it('should not remove single letter prefix (could be abbreviation)', () => {
      expect(cleanStationName('A - Station')).toBe('A - Station');
    });

    it('should handle multiple dashes in name', () => {
      expect(cleanStationName('10 - San José - Centro')).toBe('San José - Centro');
    });
  });
});

describe('paginateItems', () => {
  const testItems = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

  describe('basic pagination', () => {
    it('should return first page with correct items', () => {
      const result = paginateItems(testItems, 1, 5);
      expect(result.items).toEqual(['a', 'b', 'c', 'd', 'e']);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.totalItems).toBe(12);
    });

    it('should return second page with correct items', () => {
      const result = paginateItems(testItems, 2, 5);
      expect(result.items).toEqual(['f', 'g', 'h', 'i', 'j']);
      expect(result.pagination.currentPage).toBe(2);
    });

    it('should return last page with remaining items', () => {
      const result = paginateItems(testItems, 3, 5);
      expect(result.items).toEqual(['k', 'l']);
      expect(result.pagination.currentPage).toBe(3);
    });
  });

  describe('pagination info', () => {
    it('should calculate correct startIndex and endIndex (1-indexed for display)', () => {
      const result = paginateItems(testItems, 2, 5);
      expect(result.pagination.startIndex).toBe(6); // 1-indexed
      expect(result.pagination.endIndex).toBe(10);
    });

    it('should handle last page endIndex correctly', () => {
      const result = paginateItems(testItems, 3, 5);
      expect(result.pagination.startIndex).toBe(11);
      expect(result.pagination.endIndex).toBe(12);
    });

    it('should return pageSize in pagination info', () => {
      const result = paginateItems(testItems, 1, 5);
      expect(result.pagination.pageSize).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should clamp page to 1 if page is less than 1', () => {
      const result = paginateItems(testItems, 0, 5);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.items).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should clamp page to max if page exceeds total pages', () => {
      const result = paginateItems(testItems, 100, 5);
      expect(result.pagination.currentPage).toBe(3);
      expect(result.items).toEqual(['k', 'l']);
    });

    it('should handle empty array', () => {
      const result = paginateItems([], 1, 5);
      expect(result.items).toEqual([]);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.startIndex).toBe(0);
      expect(result.pagination.endIndex).toBe(0);
    });

    it('should handle single item array', () => {
      const result = paginateItems(['x'], 1, 10);
      expect(result.items).toEqual(['x']);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.startIndex).toBe(1);
      expect(result.pagination.endIndex).toBe(1);
    });

    it('should use default page size of 10 if not provided', () => {
      const items = Array.from({ length: 25 }, (_, i) => i);
      const result = paginateItems(items, 1);
      expect(result.items.length).toBe(10);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalPages).toBe(3);
    });
  });
});

describe('parsePageParam', () => {
  describe('valid inputs', () => {
    it('should parse valid page number string', () => {
      expect(parsePageParam('5')).toBe(5);
    });

    it('should parse "1" as 1', () => {
      expect(parsePageParam('1')).toBe(1);
    });

    it('should parse large numbers', () => {
      expect(parsePageParam('999')).toBe(999);
    });
  });

  describe('invalid inputs', () => {
    it('should return 1 for null', () => {
      expect(parsePageParam(null)).toBe(1);
    });

    it('should return 1 for empty string', () => {
      expect(parsePageParam('')).toBe(1);
    });

    it('should return 1 for non-numeric string', () => {
      expect(parsePageParam('abc')).toBe(1);
    });

    it('should return 1 for negative numbers', () => {
      expect(parsePageParam('-5')).toBe(1);
    });

    it('should return 1 for zero', () => {
      expect(parsePageParam('0')).toBe(1);
    });

    it('should return 1 for decimal strings', () => {
      expect(parsePageParam('2.5')).toBe(2); // parseInt behavior
    });

    it('should handle mixed strings by parsing the leading number', () => {
      expect(parsePageParam('3abc')).toBe(3); // parseInt behavior
    });
  });
});

describe('getAriaSort', () => {
  it('should return "none" when columnSort is null', () => {
    expect(getAriaSort(null, 'free_bikes')).toBe('none');
  });

  it('should return "none" when field does not match', () => {
    expect(getAriaSort({ field: 'empty_slots', direction: 'desc' }, 'free_bikes')).toBe('none');
  });

  it('should return "descending" when field matches and direction is desc', () => {
    expect(getAriaSort({ field: 'free_bikes', direction: 'desc' }, 'free_bikes')).toBe(
      'descending'
    );
  });

  it('should return "ascending" when field matches and direction is asc', () => {
    expect(getAriaSort({ field: 'free_bikes', direction: 'asc' }, 'free_bikes')).toBe('ascending');
  });

  it('should work with empty_slots field', () => {
    expect(getAriaSort({ field: 'empty_slots', direction: 'asc' }, 'empty_slots')).toBe(
      'ascending'
    );
    expect(getAriaSort({ field: 'empty_slots', direction: 'desc' }, 'empty_slots')).toBe(
      'descending'
    );
  });
});
