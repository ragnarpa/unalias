import { Resolver, Aliases } from "../../src/resolver";

describe("Resolver", () => {
  const aliases: Aliases = {
    alias1: ["alias2", "value1", "value2"], // => [value3,value4,value1,value2]
    alias2: ["value3", "alias3"], // => [value3,value4]
    alias3: ["value4"], // => [value4]
    alias4: ["alias1", "-value1"], // => [value3,value4,value2]
    alias5: ["alias1"], // => [value3,value4,value1,value2]
    alias6: ["alias4", "-value3"], // => [value4,value2]
    alias7: ["alias5", "-alias2", "-alias3"], // => [value1,value2]
    cyclic: ["cyclic"], // => [cyclic]
  };

  describe("resolveAll", () => {
    const tests: Iterable<{ input: string[]; expected: string[] }> = [
      {
        input: ["alias1"],
        expected: ["value3", "value4", "value1", "value2"],
      },
      {
        input: ["alias2"],
        expected: ["value3", "value4"],
      },
      {
        input: ["alias3"],
        expected: ["value4"],
      },
      {
        input: ["alias4"],
        expected: ["value3", "value4", "value2"],
      },
      {
        input: ["alias5"],
        expected: ["value3", "value4", "value1", "value2"],
      },
      {
        input: ["alias6"],
        expected: ["value4", "value2"],
      },
      {
        input: ["alias7"],
        expected: ["value1", "value2"],
      },
      {
        input: ["cyclic"],
        expected: ["cyclic"],
      },
      {
        input: ["non-alias-1", "non-alias-2"],
        expected: ["non-alias-1", "non-alias-2"],
      },
      {
        input: ["alias1", "value5"],
        expected: ["value3", "value4", "value1", "value2", "value5"],
      },
      {
        input: ["alias4", "-value3"],
        expected: ["value4", "value2"],
      },
      {
        input: ["alias5", "-alias2", "-alias3"],
        expected: ["value1", "value2"],
      },
      {
        input: ["alias3", "alias3"],
        expected: ["value4"],
      },
      {
        input: ["alias3", "-alias3"],
        expected: [],
      },
      {
        input: ["alias3", "-value4"],
        expected: [],
      },
      {
        input: ["cyclic", "alias1"],
        expected: ["cyclic", "value3", "value4", "value1", "value2"],
      },
      {
        input: ["cyclic", "-alias1"],
        expected: ["cyclic"],
      },
      {
        input: ["cyclic", "-alias1", "alias3"],
        expected: ["cyclic"],
      },
      {
        input: ["cyclic", "-alias1", "value5"],
        expected: ["cyclic", "value5"],
      },
    ];

    for (const { input, expected } of tests) {
      it(`returns [${expected}] with [${input}]`, () => {
        const r = new Resolver(aliases);
        const resolved = r.resolveAll(input);

        expect(resolved).toStrictEqual(expected);
      });
    }
  });
  describe("resolveOne", () => {
    const tests: Iterable<{ input: string; expected: string[] }> = [
      {
        input: "alias1",
        expected: ["value3", "value4", "value1", "value2"],
      },
      {
        input: "alias2",
        expected: ["value3", "value4"],
      },
      {
        input: "alias3",
        expected: ["value4"],
      },
      {
        input: "alias4",
        expected: ["value3", "value4", "value2"],
      },
      {
        input: "alias5",
        expected: ["value3", "value4", "value1", "value2"],
      },
      {
        input: "alias6",
        expected: ["value4", "value2"],
      },
      {
        input: "alias7",
        expected: ["value1", "value2"],
      },
      {
        input: "cyclic",
        expected: ["cyclic"],
      },
      {
        input: "non-alias-1",
        expected: ["non-alias-1"],
      },
    ];

    for (const { input, expected } of tests) {
      it(`returns [${expected}] with [${input}]`, () => {
        const r = new Resolver(aliases);
        const resolved = r.resolveOne(input);

        expect(resolved).toStrictEqual(expected);
      });
    }
  });

  it("checks if the example in the readme holds water", () => {
    const aliases: Aliases = {
      Al: ["Alyson", "Alyssa", "Alfred", "Albert", "Alphonse"],
      // Alias Sam itself in values. It will be removed automatically.
      Sam: ["Sam", "Samuel", "Samson", "Samantha"],
      All: ["Al", "Sam"],
      NoSam: ["All", "-Sam"],
    };

    const resolver = new Resolver(aliases);

    const all = resolver.resolveOne("All");
    const noAls = resolver.resolveAll(["All", "-Al"]);
    const noSams = resolver.resolveOne("NoSam");

    expect(all).toEqual([
      ...aliases.Al,
      ...aliases.Sam.filter((v) => v != "Sam"),
    ]);
    expect(noAls).toEqual(aliases.Sam.filter((v) => v != "Sam"));
    expect(noSams).toEqual(aliases.Al);
  });
});
