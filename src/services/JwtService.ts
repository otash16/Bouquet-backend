import jwt from 'jsonwebtoken';
import { env } from '../config/index.ts';
import { addMinuteToDate } from '../utilities/index.ts';

interface IPayload {
  sub: string;
  role?: number;
  shopId?: string | null;
}

interface IToken {
  token: string;
  expiresAt?: Date;
}

interface ITokens {
  access: IToken;
  refresh: IToken;
}

class JwtService {
  #accessKey;
  #accessTime;
  #refreshKey;
  #refreshTime;

  constructor() {
    this.#accessKey = env.ACCESS_TOKEN_KEY;
    this.#accessTime = env.ACCESS_TOKEN_TIME;
    this.#refreshKey = env.REFRESH_TOKEN_KEY;
    this.#refreshTime = env.REFRESH_TOKEN_TIME;
  }

  #generateToken(payload: IPayload, key: string, timeInSec?: number): IToken {
    if (!timeInSec) {
      return { token: jwt.sign(payload, key) };
    }

    const token = jwt.sign(payload, key, { expiresIn: timeInSec });
    const expiresAt = addMinuteToDate(timeInSec / 60);
    return { token, expiresAt };
  }

  verifyAccess(token: string) {
    return jwt.verify(token, this.#accessKey) as IPayload;
  }

  verifyRefresh(token: string) {
    return jwt.verify(token, this.#refreshKey) as IPayload;
  }

  generateAccessToken(payload: IPayload): IToken {
    return this.#generateToken(payload, this.#accessKey, this.#accessTime);
  }

  generateTokens(payload: IPayload): ITokens {
    const access: IToken = this.#generateToken(payload, this.#accessKey, this.#accessTime);
    const refresh: IToken = this.#generateToken(payload, this.#refreshKey, this.#refreshTime);
    return { access, refresh };
  }
}

export default new JwtService();
