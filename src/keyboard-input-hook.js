import { useEffect, useState } from "react";

export default function useKey(
  handleKeyCallback = null,
  keyEvent = "keyup",
  whitelist = [],
  blacklist = []
) {
  // ensure valid event keyEvent
  if (keyEvent !== "keyup" && keyEvent !== "keydown") {
    console.warn(
      "useKey keyEvent invalid, assumed keyEvent 'keydown' as fallback!"
    );
    keyEvent = "keydown";
  }
  // ensure only white- OR blacklist are set
  if (whitelist.length > 0 && blacklist.length > 0) {
    console.warn("White- and blacklist arrays > 0, emptied blacklist!");
    blacklist = [];
  }
  // init state
  const [state, setState] = useState({
    keyCode: null,
    keyCodeHistory: [],
    code: null,
    codeHistory: []
  });

  useEffect(() => {
    // check if window and dom available (to exit early on Server-Side-Rendering)
    if (
      !(
        typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
      )
    ) {
      return null;
    }

    const handleKey = e => {
      // get key details from event
      const keyCode = e.keyCode;
      const key = e.key;
      const code = e.code || "UnknownKey";


      // check if white or blacklisted
      if (whitelist.length > 0 && whitelist.indexOf(keyCode) === -1) {
        return;
      }
      if (blacklist.length > 0 && blacklist.indexOf(keyCode) > -1) {
        return;
      }

      // update state with new key details
      setState(prevState => {
        return {
          keyCode,
          keyCodeHistory: [...prevState.keyCodeHistory, keyCode],
          code,
          codeHistory: [...prevState.codeHistory, code],
          key,
        };
      });

      // handle callback (if exists)
      if (handleKeyCallback && typeof handleKeyCallback == "function") {
        handleKeyCallback({
          keyName: code,
          keyCode,
          key,
          e
        });
      }
    };
    console.log('adsasfd')
    // register event listener
    window.addEventListener(keyEvent, handleKey);
    // cleanup event listener
    return () => window.removeEventListener(keyEvent, handleKey);
  }, [handleKeyCallback, keyEvent, blacklist, whitelist]);

  return {
    keyCode: state.keyCode,
    keyCodeHistory: state.keyCodeHistory,
    keyName: state.code,
    keyNameHistory: state.codeHistory,
    key:state.key,
  };
}

export function useKeyUp(
  handleKeyCallback = null,
  whitelist = [],
  blacklist = []
) {
  return useKey(handleKeyCallback, "keyup", whitelist, blacklist);
}

export function useKeyDown(
  handleKeyCallback = null,
  whitelist = [],
  blacklist = []
) {
  return useKey(handleKeyCallback, "keydown", whitelist, blacklist);
}