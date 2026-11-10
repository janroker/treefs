import { itemNameSchema, searchTextSchema } from '../schemas';

describe('itemNameSchema', () => {
  it.each([
    'report.pdf',
    'Projects 2026',
    'ünïcöd\u00E9',
    '日本語.txt',
    'a'.repeat(255),
    '%_\'"; DROP TABLE item;--',
  ])('accepts %j', (name) => {
    expect(itemNameSchema.safeParse(name).success).toBe(true);
  });

  it.each([
    ['', 'empty'],
    ['a/b', 'slash'],
    ['a\\b', 'backslash'],
    ['.', 'dot'],
    ['..', 'dot dot'],
    [' x', 'leading space'],
    ['x ', 'trailing space'],
    ['a\u0000b', 'NUL'],
    ['evil\u202Etxt.exe', 'right-to-left override'],
    ['x\uFFFF', 'noncharacter'],
    ['\u00E9'.repeat(128), '256 bytes'],
  ])('rejects %j (%s)', (name) => {
    expect(itemNameSchema.safeParse(name).success).toBe(false);
  });

  it('normalises to NFC', () => {
    expect(itemNameSchema.parse('cafe\u0301')).toBe('caf\u00E9');
  });
});

describe('searchTextSchema', () => {
  it('allows an empty prefix', () => {
    expect(searchTextSchema.parse('')).toBe('');
  });

  it('rejects U+10FFFF, which is reserved as the prefix upper bound', () => {
    expect(searchTextSchema.safeParse('a\u{10FFFF}').success).toBe(false);
  });
});
