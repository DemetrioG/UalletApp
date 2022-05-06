import * as React from "react";

function useStateCallback(initialState: any) {
  const [state, setState] = React.useState(initialState);
  const cbRef = React.useRef<any>(null); // init mutable ref container for callbacks

  const setStateCallback = React.useCallback((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  React.useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

export default useStateCallback;
