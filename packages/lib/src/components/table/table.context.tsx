import { createContext, useContext } from "react";

export type TableContextProps = Partial<{ sticky: number }>;

const TableContext = createContext<TableContextProps>({});

export const TableProvider = TableContext.Provider;

export const useTable = () => useContext(TableContext);
