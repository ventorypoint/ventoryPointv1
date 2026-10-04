import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center">
          {/* We will replace this with the proper brand logo later */}
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
            VP
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            VentoryPoint
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}
