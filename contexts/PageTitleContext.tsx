"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PageTitleContextType {
  isFixed: boolean;
  setIsFixed: (isFixed: boolean) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(
  undefined,
);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [isFixed, setIsFixed] = useState(false);

  return (
    <PageTitleContext.Provider value={{ isFixed, setIsFixed }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error("usePageTitle must be used within a PageTitleProvider");
  }
  return context;
}
