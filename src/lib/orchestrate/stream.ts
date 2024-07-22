import { share } from "rxjs";
import { OrchestrateConfigProp } from ".";
import ClearableStateStream from "../ClearableStateStream";
const temp = ClearableStateStream<OrchestrateConfigProp>();
export const orchestrateConfigPropStream = {
  ...temp,
  stateStream: temp.stateStream.pipe(share()),
};
