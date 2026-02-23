import React from "react";

function ComingSoon({ title }) {
  return (
    <div className="text-white p-12 text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="text-lg text-white/80">This feature is coming soon!</div>
    </div>
  );
}

export default ComingSoon;
