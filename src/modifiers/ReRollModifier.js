import { DieActionValueError } from '../exceptions/index.js';
import ComparisonModifier from './ComparisonModifier.js';

const onceSymbol = Symbol('once');

/**
 * A `ReRollModifier` re-rolls dice that match a given test, and replaces the new value with the old
 * one.
 *
 * @see {@link ExplodeModifier} if you want to keep the old value as well
 *
 * @extends ComparisonModifier
 */
class ReRollModifier extends ComparisonModifier {
  /**
   * The default modifier execution order.
   *
   * @type {number}
   */
  static order = 4;

  /**
   * Create a `ReRollModifier` instance.
   *
   * @param {boolean} [once=false] Whether to only re-roll once or not
   * @param {ComparePoint} [comparePoint=null] The comparison object
   */
  constructor(once = false, comparePoint = null) {
    super(comparePoint);

    this.once = !!once;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * The name of the modifier.
   *
   * @returns {string} 're-roll'
   */
  get name() {
    return 're-roll';
  }
  /* eslint-enable class-methods-use-this */

  /**
   * The modifier's notation.
   *
   * @returns {string}
   */
  get notation() {
    return `r${this.once ? 'o' : ''}${super.notation}`;
  }

  /**
   * Whether the modifier should only re-roll once or not.
   *
   * @returns {boolean} `true` if it should re-roll once, `false` otherwise
   */
  get once() {
    return !!this[onceSymbol];
  }

  /**
   * Set whether the modifier should only re-roll once or not.
   *
   * @param {boolean} value
   */
  set once(value) {
    this[onceSymbol] = !!value;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * The default compare point definition
   *
   * @param {StandardDice|RollGroup} _context The object that the modifier is attached to
   *
   * @returns {array}
   */
  defaultComparePoint(_context) {
    return ['=', _context.min];
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Run the modifier on the results.
   *
   * @param {RollResults} results The results to run the modifier against
   * @param {StandardDice|RollGroup} _context The object that the modifier is attached to
   *
   * @returns {RollResults} The modified results
   */
  run(results, _context) {
    super.run(results, _context);

    // ensure that the dice can explode without going into an infinite loop
    if (_context.min === _context.max) {
      throw new DieActionValueError(_context, 're-roll');
    }

    results.rolls
      .map((roll) => {
        // re-roll if the value matches the compare point, and we haven't hit the max iterations,
        // unless we're only rolling once and have already re-rolled
        for (let i = 0; (i < this.maxIterations) && this.isComparePoint(roll.value); i++) {
          // re-roll the dice
          const rollResult = _context.rollOnce();

          // update the roll value (Unlike exploding, the original value is not kept)
          // eslint-disable-next-line no-param-reassign
          roll.value = rollResult.value;

          // add the re-roll modifier flag
          roll.modifiers.add(`re-roll${this.once ? '-once' : ''}`);

          // stop the loop if we're only re-rolling once
          if (this.once) {
            break;
          }
        }

        return roll;
      });

    return results;
  }

  /**
   * Return an object for JSON serialising.
   *
   * This is called automatically when JSON encoding the object.
   *
   * @returns {{
   *  notation: string,
   *  name: string,
   *  type: string,
   *  comparePoint: (ComparePoint|undefined),
   *  once: boolean
   * }}
   */
  toJSON() {
    const { once } = this;

    return Object.assign(
      super.toJSON(),
      {
        once,
      },
    );
  }
}

export default ReRollModifier;
