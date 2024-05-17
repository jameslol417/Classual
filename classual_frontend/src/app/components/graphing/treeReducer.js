
function treeReducer(
    state,
    action
  ) {
    let newState;
    switch (action.type) {
      case "initialize":
        const newTree = action.payload;
        newState = {
          tree: newTree,
        //   bounds: setPositions(newTree),
        };
        return newState;
      case "open":
        if (!state) {
          return state;
        }
        action.payload.state = "open";
        newState = {
          tree: state.tree,
        //   bounds: setPositions(state.tree),
        };
        return newState;
      case "close":
        if (!state) {
          return state;
        }
        action.payload.state = "closed";
        newState = {
          tree: state.tree,
        //   bounds: setPositions(state.tree),
        };
        return newState;
      default:
        return state;
    }
  }

export default treeReducer
