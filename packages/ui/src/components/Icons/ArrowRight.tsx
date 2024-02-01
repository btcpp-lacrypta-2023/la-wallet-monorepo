import React from 'react';

export function ArrowRightIcon({ color = 'currentColor' }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color}>
        <path
          fillRule="evenodd"
          d="M13.483 4.47a.75.75 0 011.06 0l6.988 7a.75.75 0 010 1.06l-6.988 7a.75.75 0 01-1.061-1.06l5.709-5.719L3 12.762a.75.75 0 01-.002-1.5l16.194-.01-5.711-5.722a.75.75 0 010-1.06z"
          clipRule="evenodd"
        ></path>
      </svg>
    </>
  );
}
