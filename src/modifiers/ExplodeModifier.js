import { DieActionValueError } from '../exceptions';
import { diceUtils } from '../utilities/utils';
import ComparisonModifier from './ComparisonModifier';

const compoundSymbol = Symbol('compound');
const penetrateSymbol = Symbol('penetrate');

/**
 * An `ExplodeModifier` re-rolls dice that match a given test, and adds them to the results.
 *
 * @see {@link ReRollModifier} if you want to replace the old value with the new, rather than adding
 *
 * @extends ComparisonModifier
 */
class ExplodeModifier extends ComparisonModifier {
  /**
   * Create an `ExplodeModifier` instance
   *
   * @param {ComparePoint} [comparePoint=null] The comparison object
   * @param {boolean} [compound=false] Whether to compound or not
   * @param {boolean} [penetrate=false] Whether to penetrate or not
   *
   * @throws {TypeError} comparePoint must be a `ComparePoint` object
   */
  constructor(comparePoint = null, compound = false, penetrate = false) {
    super(comparePoint);

    this[compoundSymbol] = !!compound;
    this[penetrateSymbol] = !!penetrate;

    // set the modifier's sort order
    this.order = 3;
  }

  /**
   * Whether the modifier should compound the results or not.
   *
   * @returns {boolean} `true` if it should compound, `false` otherwise
   */
  get compound() {
    return this[compoundSymbol];
  }

  /* eslint-disable class-methods-use-this */
  /**
   * The name of the modifier.
   *
   * @returns {string} 'explode'
   */
  get name() {
    return 'explode';
  }
  /* eslint-enable class-methods-use-this */

  /**
   * The modifier's notation.
   *
   * @returns {string}
   */
  get notation() {
    return `!${this.compound ? '!' : ''}${this.penetrate ? 'p' : ''}${super.notation}`;
  }

  /**
   * Whether the modifier should penetrate the results or not.
   *
   * @returns {boolean} `true` if it should penetrate, `false` otherwise
   */
  get penetrate() {
    return this[penetrateSymbol];
  }

  /**
   * Run the modifier on the results.
   *
   * @param {RollResults} results The results to run the modifier against
   * @param {StandardDice} _dice The die that the modifier is attached to
   *
   * @returns {RollResults} The modified results
   */
  run(results, _dice) {
    // ensure that the dice can explode without going into an infinite loop
    if (_dice.min === _dice.max) {
      throw new DieActionValueError(_dice, 'explode');
    }

    const parsedResults = results;

    parsedResults.rolls = results.rolls
      .map((roll) => {
        const subRolls = [roll];
        let compareValue = roll.value;

        // explode if the value matches the compare point, and we haven't reached the max iterations
        for (let i = 0; (i < this.maxIterations) && this.isComparePoint(compareValue); i++) {
          const prevRoll = subRolls[subRolls.length - 1];
          // roll the dice
          const rollResult = _dice.rollOnce();

          // update the value to check against
          compareValue = rollResult.value;

          // add the explode modifier flag
          prevRoll.modifiers.add('explode');

          // add the penetrate modifier flag and decrement the value
          if (this.penetrate) {
            prevRoll.modifiers.add('penetrate');
            rollResult.value -= 1;
          }

          // add the rolls to the list
          subRolls.push(rollResult);
        }

        // return the rolls (Compounded if necessary)
        /* eslint-disable  no-param-reassign */
        if (this.compound && (subRolls.length > 1)) {
          // update the roll value and modifiers
          roll.value = diceUtils.sumArray(subRolls.map((result) => result.value));
          roll.modifiers = [
            'explode',
            'compound',
          ];

          if (this.penetrate) {
            roll.modifiers.add('penetrate');
          }

          return roll;
        }
        /* eslint-enable */

        return subRolls;
      })
      .flat();

    return parsedResults;
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
   *  compound: boolean,
   *  penetrate: boolean
   * }}
   */
  toJSON() {
    const { compound, penetrate } = this;

    return Object.assign(
      super.toJSON(),
      {
        compound,
        penetrate,
      },
    );
  }
}

export default ExplodeModifier;
