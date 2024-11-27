import React from "react";

interface AchievementGoalProps {
  initialGoal?: string;
}

export const AchievementGoal: React.FC<AchievementGoalProps> = ({
  initialGoal = "",
}) => {
  return (
    <section className="flex-1 shrink self-stretch my-auto max-md:max-w-full">
      <h2 className="sr-only">Achievement Goal</h2>
      <p className="text-lg">
        {initialGoal || "What do you hope to achieve with Skim?"}
      </p>
    </section>
  );
};
