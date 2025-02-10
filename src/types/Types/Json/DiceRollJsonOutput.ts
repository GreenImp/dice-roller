import { JsonOutput } from "./JsonOutput";
import { RollResult } from "../RollResult";

export type DiceRollJsonOutput = JsonOutput & {
  averageTotal: number;
  maxTotal: number;
  minTotal: number;
  notation: string;
  output: string;
  rolls: RollResult[];
  total: number;
};
