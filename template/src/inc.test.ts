import assert from "assert";
import { inc } from ".";

describe("inc", () => {
  it("should increment the number", async () => {
    assert.strictEqual(inc(2), 3);
  });
});
