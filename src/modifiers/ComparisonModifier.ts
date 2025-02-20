import Modifier from './Modifier';
import ComparePoint from '../ComparePoint';
import { Comparator } from "../types/Interfaces/Comparator";
import { Modifiable } from "../types/Interfaces/Modifiable";
import { ComparatorModifier } from "../types/Interfaces/Modifiers/ComparatorModifier";
import { ModifierJsonOutput } from "../types/Types/Json/ModifierJsonOutput";

/**
 * A `ComparisonModifier` is the base modifier class for comparing values.
 *
 * @abstract
 *
 * @extends Modifier
 *
 * @see {@link CriticalFailureModifier}
 * @see {@link CriticalSuccessModifier}
 * @see {@link ExplodeModifier}
 * @see {@link ReRollModifier}
 * @see {@link TargetModifier}
 */
class ComparisonModifier extends Modifier implements ComparatorModifier {
  #comparator: Comparator|null = null;

  /**
   * Create a `ComparisonModifier` instance.
   *
   * @param {ComparePoint} [comparator] The comparison object
   *
   * @throws {TypeError} `comparePoint` must be an instance of `ComparePoint` or `undefined`
   */
  constructor(comparator?: Comparator) {
    super();

    this.comparePoint = comparator ?? null;
  }

  /**
   * The compare point.
   *
   * @returns {ComparePoint|undefined}
   */
  get comparePoint(): Comparator|null {
    return this.#comparator;
  }

  /**
   * Set the compare point.
   *
   * @param {ComparePoint} comparePoint
   *
   * @throws {TypeError} value must be an instance of `ComparePoint`
   */
  set comparePoint(comparePoint: Comparator|null) {
    if (!(comparePoint instanceof ComparePoint)) {
      throw new TypeError('comparePoint must be instance of ComparePoint');
    }

    this.#comparator = comparePoint;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * The name of the modifier.
   *
   * @returns {string} 'comparison'
   */
  override get name(): string {
    return 'comparison';
  }
  /* eslint-enable class-methods-use-this */

  /**
   * The modifier's notation.
   *
   * @returns {string}
   */
  override get notation(): string {
    return `${this.comparePoint || ''}`;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Empty default compare point definition
   *
   * @param {StandardDice|RollGroup} _context The object that the modifier is attached to
   *
   * @returns {null}
   */
  protected override defaultComparePoint(_context: Modifiable): [string, number]|null {
    return null;
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Eases processing of simple "compare point only" defaults
   *
   * @param {StandardDice|RollGroup} _context The object that the modifier is attached to
   *
   * @returns {object}
   */
  protected override defaults(_context: Modifiable): { [index: string]: unknown } {
    const comparePointConfig = this.defaultComparePoint(_context);

    if (Array.isArray(comparePointConfig) && comparePointConfig.length === 2) {
      return {
        comparePoint: new ComparePoint(...comparePointConfig),
      };
    }

    return {};
  }

  /**
   * Check whether value matches the compare point or not.
   *
   * @param {number} value The value to compare with
   *
   * @returns {boolean} `true` if the value matches, `false` otherwise
   */
  isComparePoint(value: number): boolean {
    return this.comparePoint?.isMatch(value) ?? false;
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
   *  comparePoint: (ComparePoint|undefined)
   * }}
   */
  override toJSON(): ModifierJsonOutput & {comparePoint?: Comparator|null} {
    const { comparePoint } = this;

    return Object.assign(
      super.toJSON(),
      {
        comparePoint,
      },
    );
  }
}

export default ComparisonModifier;
