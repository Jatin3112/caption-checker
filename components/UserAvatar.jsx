import { Sparkle, Zap, Crown, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UserAvatar({ session }) {
  const plan = session?.user.plan;

  const planIcons = {
    free: <Sparkle className="w-4 h-4 text-yellow-400" />,
    vision: <Sparkles className="w-4 h-4 text-pink-400" />,
    popular: <Zap className="w-4 h-4 text-blue-400" />,
    pro: <Crown className="w-4 h-4 text-indigo-400" />,
  };

  const planLabels = {
    free: "Starter Plan",
    vision: "Vision Plan",
    popular: "Popular Plan",
    pro: "Pro Plan",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative w-8 h-8 rounded-full bg-indigo-500 dark:bg-violet-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
            {(session?.user.fullName || session?.user.email)[0]?.toUpperCase()}

            {/* Plan icon (top-right corner of avatar) */}
            {plan && (
              <span className="absolute -top-1 -right-1 dark:bg-gray-900 rounded-full p-0.5 shadow">
                {planIcons[plan]}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-50 dark:bg-slate-900">
          <p>{planLabels[plan]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
