import { Any } from "../../types";
import { Filter } from "./filter";
import { Group } from "./group";
import { Sort } from "./sort";
import { TableOperationProps, valueFromType } from "./table-lib";

export const Metadata = <T extends Any>(props: TableOperationProps<T>) => (
  <header className="mb-1 min-w-full">
    <div className="flex flex-wrap gap-y-1 gap-x-4 justify-between items-center min-w-full">
      <div className="flex gap-4 py-2 whitespace-nowrap w-fit items-centeend">
        <span>
          <Filter cols={props.cols} options={props.options} filters={props.filters} set={props.setFilters} />
        </span>
        <span>
          <Sort options={props.options} cols={props.cols} sorters={props.sorters} set={props.setSorters} />
        </span>
        <span>
          <Group rows={props.rows} groups={props.groups} setGroups={props.setGroups} options={props.options} cols={props.cols} />
        </span>
      </div>
      <ul className="flex flex-row flex-wrap flex-1 grow gap-4 items-center w-full md:justify-end">
        {props.filters.map((x) => (
          <li key={`filter-table-${x.id}`} className="flex gap-1 items-center py-0.5 px-4 rounded-xl border border-card-border">
            <span>
              <span className="inline-block mr-2 rounded-full size-3 aspect-square bg-primary" aria-hidden="true" />
              {x.label} {x.operation.label.toLowerCase()}:
            </span>
            <div className="relative w-min min-w-[1ch]">
              <span aria-hidden="true" className="invisible p-0 whitespace-pre">
                {x.value || " "}
              </span>
              <input
                type={x.type}
                value={x.value as string}
                className="absolute left-0 top-0 m-0 inline-block w-full bg-transparent p-0 placeholder-primary/70 outline-hidden [appearance:textfield] empty:after:text-primary/70 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => {
                  const value = valueFromType(e.target);
                  props.setFilters((prev) =>
                    prev.map((item) =>
                      x.id === item.id
                        ? { ...item, value, } : item
                    )
                  );
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </header>
);
