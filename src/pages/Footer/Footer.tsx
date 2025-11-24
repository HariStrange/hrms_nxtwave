import React from "react";
import { Users2, LucideHandshake, GraduationCapIcon } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-8 border-t border-border pb-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Evallo Hrms.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GraduationCapIcon className="h-3 w-3" />
            Employee Monitoring
          </span>
          <span className="flex items-center gap-1">
            <LucideHandshake className="h-3 w-3" />
            Teams Management
          </span>
          <span className="flex items-center gap-1">
            <Users2 className="h-3 w-3" />
            Team Assignment
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
