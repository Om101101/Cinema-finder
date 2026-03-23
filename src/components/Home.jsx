import React from "react";
import Sidenav from "./templates/Sidenav";
import Topnav from "./templates/Topnav";

function Home() {
  document.title = "SCSD| Homepage";
  return (
    <>
      <div className="flex w-full h-screen bg-zinc-900">
        <Sidenav />
        <div className="w-[80%] h-full overflow-hidden">
          <Topnav />
        </div>
      </div>
    </>
  );
}

export default Home;
