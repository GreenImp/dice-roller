import { JsonOutput } from "./JsonOutput";
import { ModifierCollection } from "../ModifierCollection";
import Description from "../../../Description";

export type DiceJsonOutput = JsonOutput & {
  average: number,
  description: Description | null,
  max: number,
  min: number,
  modifiers: ModifierCollection,
  notation: string,
  qty: number,
  sides: number|string,
};
