import * as assert from "assert";
import { inc } from ".";

describe("inc", () => {
  it("should increment the number", async () => {
    assert.equal(inc(2), 3);
  });
});
