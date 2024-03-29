/**
 * A map of key-value pairs where the key is an alias (string)
 * and the value is an array of strings. The array can
 * contain values that refer to other aliases in the same map.
 */
export type Aliases = {
  [key: string]: string[];
};

/**
 * Represents a resolver.
 * @constructor
 * @param {Aliases} aliases - a map of alias definitions
 */
export class Resolver {
  readonly aliases: Aliases;

  constructor(aliases: Aliases) {
    this.aliases = aliases;
  }

  /**
   * Resolve aliases to terminal values. The input can contain mixed values -
   * terminal values and aliases. `resolveAll` will replace all the aliases
   * with their respective terminal values.
   * @param {string[]} values - an array of string values (terminal values and aliases)
   * @returns {string[]} - an array of terminal values (contains no aliases)
   */
  resolveAll(values: string[]): string[] {
    // For result.
    const resolved: Set<string> = new Set();
    // For seen aliases to detect cycles.
    const seen: Set<string> = new Set();
    // For values to be removed after full resolution.
    const removals: Set<string> = new Set();

    function resolve(this: Resolver, values: string[], remove = false): void {
      for (const item of values.map((v) => (remove ? `-${v}` : v))) {
        const removal = item.startsWith("-");
        let val = item;

        if (removal) {
          val = item.substring(item.indexOf("-") + 1);
        }

        if (seen.has(val) && !removal && !remove) {
          // We are in a cycle. Break it.
          continue;
        }

        if (val in this.aliases) {
          seen.add(val);
          // Filter out the alias itself. We don't want to resolve it again.
          const values = this.aliases[val].filter((v) => v != val);
          resolve.call(this, values, removal);
          // The alias resolves into itself.
          // Consider it as a terminal value.
          if (!values.length && !removal) {
            resolved.add(val);
          }
          if (removal) {
            removals.add(val);
          }
        } else {
          if (remove || removal) {
            removals.add(val);
          } else {
            resolved.add(val);
          }
        }
      }
    }

    resolve.call(this, values, false);

    for (const item of removals) {
      resolved.delete(item);
    }

    return Array.from(resolved);
  }

  /**
   * A wrapper around `resolveAll` for single input.
   * @param {string} value - an alias to resolve
   * @returns {string[]} - an array of terminal values (contains no aliases)
   */
  resolveOne(value: string): string[] {
    return this.resolveAll([value]);
  }
}
