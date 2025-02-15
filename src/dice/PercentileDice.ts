import StandardDice from './StandardDice';
import {ModifierCollection} from "../types/Types/ModifierCollection";
import Description from "../Description";

/**
 * Represents a percentile die.
 *
 * @extends StandardDice
 */
class PercentileDice extends StandardDice {
  readonly #sidesAsNumber: boolean = false;

  /**
   * Create a `PercentileDice` instance.
   *
   * @param {number} [qty=1] The number of dice to roll (e.g. `4`)
   * @param {Map<string, Modifier>|Modifier[]|{}|null} [modifiers] The modifiers that affect the die
   * @param {boolean} [sidesAsNumber=false] Whether to show the sides as `%` (default) or `100`
   * @param {Description|string|null} [description=null] The roll description.
   *
   * @throws {TypeError} qty must be a positive integer, and modifiers must be valid
   */
  constructor(
    qty: number = 1,
    modifiers: ModifierCollection | null = null,
    sidesAsNumber: boolean = false,
    description: Description|string|null = null
  ) {
    super(100, qty, modifiers, null, null, description);

    this.#sidesAsNumber = !!sidesAsNumber;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * The name of the die.
   *
   * @returns {string} 'percentile'
   */
  get name(): string {
    return 'percentile';
  }
  /* eslint-enable class-methods-use-this */

  /**
   * The number of sides the die has
   *
   * @returns {number|string} `%` if `sidesAsNumber == false`, or `100` otherwise
   */
  get sides(): number|string {
    return this.#sidesAsNumber ? super.sides : '%';
  }
}

export default PercentileDice;
