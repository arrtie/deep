import { useEffect, useState } from "preact/hooks";
import { map } from "rxjs";
import { configAggregatorStream } from ".";
import { ConfigAggregator } from "../../types";

const userSelectedConfigAggregationStream = configAggregatorStream.pipe(
  map((agg) => {
    console.log("AGG: ", agg);
    return agg;
  })
);

export default function useUserSelectedConfigs() {
  const [options, setOptions] = useState<ConfigAggregator>({ bg: [], int: [] });

  useEffect(() => {
    const subscription = userSelectedConfigAggregationStream.subscribe({
      next(configAgg) {
        console.log("updating UserSelection: ", configAgg);
        setOptions(configAgg);
      },
    });
    return () => {
      console.trace(" unsub useUserSelection");
      subscription.unsubscribe();
    };
  }, []);

  return options;
}
