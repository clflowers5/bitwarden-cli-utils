import throwIfPresent from './../../src/errorHelpers/throwIfPresent';

describe('throwIfPresent', () => {
  it.each([true, 'hello', '41', 125, { msg: 'yolo' }, [1, 2]])(
    'throws with truthy value: %p',
    input => {
      expect(() => throwIfPresent(input)).toThrow(new Error(input));
    }
  );

  it.each([false, '', 0, null, undefined])(
    'does not throw with falsey value: %p',
    input => {
      expect(() => throwIfPresent(input)).not.toThrow();
      expect(throwIfPresent(input)).toBe(undefined);
    }
  );
});
