import { formatDate, getColorClass, truncateText } from '../helpers';
import { Colors } from '../../types/note.types';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const formatted = formatDate(dateString);
      
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      expect(formatted).toMatch(/\d{4}/); // Contains year
    });

    it('should handle different date formats', () => {
      const dateString = '2024-12-25T15:45:00.000Z';
      const formatted = formatDate(dateString);
      
      expect(formatted).toBeTruthy();
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('getColorClass', () => {
    it('should return correct class for YELLOW color', () => {
      expect(getColorClass(Colors.YELLOW)).toBe('bg-note-yellow');
    });

    it('should return correct class for BLUE color', () => {
      expect(getColorClass(Colors.BLUE)).toBe('bg-note-blue');
    });

    it('should return correct class for GREY color', () => {
      expect(getColorClass(Colors.GREY)).toBe('bg-note-grey');
    });

    it('should return default YELLOW class for invalid color', () => {
      expect(getColorClass('INVALID' as Colors)).toBe('bg-note-yellow');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that should be truncated';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result.length).toBe(maxLength + 3); // +3 for '...'
      expect(result).toMatch(/\.\.\.$/);
    });

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result).toBe(text);
      expect(result).not.toContain('...');
    });

    it('should not truncate text equal to maxLength', () => {
      const text = 'Exactly twenty chars';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result).toBe(text);
      expect(result).not.toContain('...');
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });

    it('should handle very short maxLength', () => {
      const text = 'Hello World';
      const maxLength = 5;
      const result = truncateText(text, maxLength);
      
      expect(result).toBe('Hello...');
      expect(result.length).toBe(8);
    });
  });
});

