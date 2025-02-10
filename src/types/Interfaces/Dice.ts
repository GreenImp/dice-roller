import { Stringable } from "./Stringable";
import { JsonSerializable } from "./JsonSerializable";
import { ModelType } from "../Enums/ModelType";
import Description from "../../Description";
import { Describable } from "./Describable";
import { Modifiable } from "./Modifiable";
import { HasNotation } from "./HasNotation";
import { ModifierCollection } from "../Types/ModifierCollection";
import { Nameable } from "./Nameable";
import { ResultCollection } from "./Results/ResultCollection";
import { SingleResult } from "./Results/SingleResult";
import { DiceJsonOutput } from "../Types/Json/DiceJsonOutput";

export interface Dice extends Describable, Readonly<HasNotation>, JsonSerializable, Modifiable, Readonly<Nameable>, Stringable {
  readonly average: number;
  readonly max: number,
  readonly min: number,
  readonly qty: number;
  readonly sides: number | string;

  roll(): ResultCollection;

  rollOnce(): SingleResult;

  toJSON(): DiceJsonOutput;
}
