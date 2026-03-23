import React from "react";
import Sidenav from "./templates/Sidenav";
import Topnav from "./templates/Topnav";

function Home() {
  document.title = "SCSDB | Homepage";

  return (
    <>
      <style>{`
        /* matches Sidenav fixed widths exactly */
        .home-layout {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: #0c0b13;
        }

        /* main content pushed right by sidebar width */
        .home-main {
          margin-left: 258px;        /* desktop: full sidebar */
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: margin-left 0.34s cubic-bezier(0.4,0,0.2,1);
        }

        /* Tablet — icon rail */
        @media (max-width: 1024px) and (min-width: 769px) {
          .home-main {
            margin-left: 74px;
          }
        }

        /* Mobile — sidebar is off-screen drawer, no offset needed */
        @media (max-width: 768px) {
          .home-main {
            margin-left: 0;
            padding-bottom: 62px;   /* space for bottom nav bar */
          }
        }
      `}</style>

      <div className="home-layout">
        <Sidenav />

        <div className="home-main">
          <Topnav />

          {/* Page content goes here */}
        </div>
      </div>
    </>
  );
}

export default Home;
