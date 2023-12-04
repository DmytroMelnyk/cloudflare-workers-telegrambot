// to support crypto you should set edge env
// @vitest-environment edge-runtime

import { describe, expect, it } from 'vitest';
import { validate } from "../src/bot/web_app";
import '../src/__global';

describe('FitbitApiClient', () => {
    it('should return sleep data', async () => {
        const result = await validate(new URLSearchParams({
            "hash": "eec50695cc26efe836eff65ef99a8a72bc0e2cffd78dfdf637c51e61cdc2c22a",
            "user_id": "john_doe",
            "someInfo": "my data"
        }), "bot_token");

        expect(result).true;
    });
});