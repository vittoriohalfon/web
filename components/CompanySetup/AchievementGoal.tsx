import React, { useState } from "react";

interface AchievementGoalProps {
  initialGoal?: string;
}

export const AchievementGoal: React.FC<AchievementGoalProps> = ({
  initialGoal = "",
}) => {
  const [achievementGoal, setAchievementGoal] = useState<string>(initialGoal);

  return (
    <section className="flex-1 shrink self-stretch my-auto max-md:max-w-full">
      <h2 className="sr-only">Achievement Goal</h2>
      <p className="text-lg">
        {achievementGoal || "What do you hope to achieve with Skim?"}
      </p>
    </section>
  );
};
