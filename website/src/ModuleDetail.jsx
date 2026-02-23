import React from "react";
import { useParams } from "react-router-dom";
import AnalyticsChart from "./AnalyticsChart";

const MODULE_DETAILS = {
  attendance: {
    name: "Attendance",
    description: "Manage and track student attendance records.",
    content: "[Attendance management UI coming soon!]"
  },
  library: {
    name: "Library",
    description: "Access and manage library resources.",
    content: "[Library management UI coming soon!]"
  },
  analytics: {
    name: "Analytics",
    description: "View campus analytics and reports.",
    content: "[Analytics dashboard coming soon!]"
  }
};

function ModuleDetail() {
  const { moduleId } = useParams();
  const details = MODULE_DETAILS[moduleId] || {
    name: "Module",
    description: "No details available.",
    content: "[Details coming soon!]"
  };
  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-2">{details.name}</h2>
      <div className="mb-4 text-lg text-white/80">{details.description}</div>
      <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
        {details.content}
      </div>
      {moduleId === "analytics" && <AnalyticsChart />}
    </div>
  );
}

export default ModuleDetail;
