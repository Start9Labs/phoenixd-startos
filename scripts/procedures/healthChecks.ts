import { types as T, healthUtil } from "../deps.ts";

export const health: T.ExpectedExports.health = {
  "state": healthUtil.checkWebUrl("http://phoenixd.embassy:9740/getinfo")
}