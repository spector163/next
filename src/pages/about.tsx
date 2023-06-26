import React, { useState } from "react";
import { useBeforeunload } from "~/utils/confirmExit";

const App: React.FC = () => {
  const [value, setValue] = useState("");
  //@ts-ignore
  useBeforeunload(value !== "" ? (event) => event.preventDefault() : null);

  return (
    <div>
      <input onChange={(event) => setValue(event.target.value)} value={value} />
      <label htmlFor="">input</label>
    </div>
  );
};

export default App;
