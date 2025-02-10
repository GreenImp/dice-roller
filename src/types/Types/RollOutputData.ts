import { ExpressionResult } from "../Interfaces/Results/ExpressionResult";
import { RollResult } from "./RollResult";

// @todo think of better name for this
export type RollOutputData = {
  notation: string;
  rolls: ExpressionResult|RollResult[];
};
