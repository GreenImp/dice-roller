import { JsonOutput } from "./JsonOutput";
import { ExpressionCollection } from "../ExpressionCollection";
import Description from "../../../Description";
import { ModifierCollection } from "../ModifierCollection";

export type RollGroupJsonOutput = JsonOutput & {
  description: Description|null;
  expressions: ExpressionCollection;
  modifiers: ModifierCollection;
  notation: string;
};
