import React from "react";

const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card border border-border/50 shadow-lg text-center max-w-xs animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Custom Spinner using theme primary color */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        </div>

        {/* Content using theme typography colors */}
        <div className="space-y-1">
          <h3 className="font-heading text-sm font-semibold text-foreground tracking-wide">
            Loading Application
          </h3>
          <p className="text-xs text-muted-foreground">
            Please wait while we set things up...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
