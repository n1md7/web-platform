import bcrypt from "bcrypt";
import StringUtils from "../../src/helpers/StringUtils";

describe('StringUtils.hashPassword', () => {
  it('should hash password and return string', async () => {
    const password = 'veryStrongPassword321';
    const hashed = await StringUtils.hashPassword(password);
    expect(hashed).toEqual(expect.any(String));
  });

  it('should hash two passwords and compare', async () => {
    const passwordOne = 'veryStrongPassword321';
    const passwordTwo = 'veryStrongPassword321';
    const passwordThree = 'somethingElse';
    const hashedOne = await StringUtils.hashPassword(passwordOne);
    const hashedTwo = await StringUtils.hashPassword(passwordTwo);
    const hashedThree = await StringUtils.hashPassword(passwordThree);
    expect(hashedOne).not.toBe(hashedTwo);
    expect(hashedOne).not.toBe(hashedThree);
    expect(hashedThree).not.toBe(hashedTwo);
  });
});

describe('StringUtils.hashCompare', () => {
  it('should compare hashed password with passed value', async () => {
    const password = 'veryStrongPassword321';
    const hashed = await StringUtils.hashPassword(password);
    const hashedAgain = await StringUtils.hashPassword(password);

    const isValid = await StringUtils.hashCompare(password, hashed);
    const isValidAgain = await StringUtils.hashCompare(password, hashedAgain);
    expect(isValid).toBeTruthy();
    expect(isValidAgain).toBeTruthy();
    // They are not the same
    expect(hashed).not.toBe(hashedAgain);
  });

  it('should reject', async () => {
    type Callback = (error: string, hash: null) => string;
    jest.spyOn(bcrypt, 'hash')
      .mockImplementation((password: string, saltRounds: number, callback: Callback) => {
        callback('ERROR:Rejected', null);
      });
    const password = 'veryStrongPassword321';
    await StringUtils.hashPassword(password).catch(error => {
      expect(error).toBe('ERROR:Rejected');
    });
  });
});

describe('StringUtils.randomChars', () => {
  it('should generate random chars', () => {
    const chars = StringUtils.randomChars(10);
    expect(chars).toEqual(expect.any(String));
    expect(chars).toHaveLength(10);
  });
});

describe.each([
  ['123', 64],
  ['', 64],
  ['short text', 64],
  ['very long text 123 haha..hmmm', 64]
])('StringUtils.createHashFromBuffer(%s) => should generate hash from buffer with len: %d', (value, expectedLength) => {
  expect(StringUtils.createHashFromBuffer(value)).toHaveLength(expectedLength);
});
