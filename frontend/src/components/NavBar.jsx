import React from "react";
import ThemeChanger from "./ThemeChanger";
const NavBar = ({ time }) => (
  <div className="navbar bg-base-300 p-3">
    <div className="flex-1">
      <a className="btn btn-ghost text-3xl text-accent">TinyGS Dash</a>
    </div>
    <div className="flex-none mr-2">
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <ThemeChanger />
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-accent">
            <span style={{ "--value": time.hours }}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-accent">
            <span style={{ "--value": time.minutes }}></span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-error">
            <span style={{ "--value": time.seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  </div>
);

export default NavBar;
