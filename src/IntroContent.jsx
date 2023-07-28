// IntroContent.jsx
import React from "react";

function IntroContent() {
  const handleClick = () => {
    const event = new CustomEvent("startButtonClick");
    window.dispatchEvent(event);
  };

  return (
    <>
      <h1>Rodrispective</h1>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <button id="start-button" onClick={handleClick}>
        Explore
      </button>
    </>
  );
}

export default IntroContent;
