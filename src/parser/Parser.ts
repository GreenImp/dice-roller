import { RequiredArgumentError } from '../exceptions/index';
import * as parser from './grammars/grammar.js';

/**
 * The `Parser` takes a notation string and parses it into objects.
 *
 * It is used internally by the DiceRoll object when rolling notation, but can be used by itself if
 * necessary.
 *
 * @see {@link https://dice-roller.github.io/documentation/guide/notation/}
 * @see {@link https://en.m.wikipedia.org/wiki/Dice_notation}
 */
class Parser {
  /**
   * Parses the given dice notation and returns a list of dice and modifiers found
   *
   * @param {string} notation The notation to parse
   *
   * @returns {Array}
   *
   * @throws {RequiredArgumentError} Notation is required
   * @throws {SyntaxError} The notation syntax is invalid
   * @throws {TypeError} Notation must be a string
   * @todo figure out correct return type
   */
  static parse(notation: string): unknown[] {
    if (!notation) {
      throw new RequiredArgumentError('notation');
    }

    if (typeof notation !== 'string') {
      throw new TypeError('Notation must be a string');
    }

    // parse the notation
    return parser.parse(notation) as unknown[];
  }
}

export default Parser;
