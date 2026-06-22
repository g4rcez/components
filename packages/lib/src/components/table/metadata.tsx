import type { Any } from "../../types";
import { Filter } from "./filter";
import { Group } from "./group";
import { Sort } from "./sort";
import { tableMetadataStyles } from "./metadata.styles";
import { type TableOperationProps, valueFromType } from "./table-lib";

export const Metadata = <T extends Any>(props: TableOperationProps<T>) => (
    <header className={tableMetadataStyles.slots.root}>
        <div className={tableMetadataStyles.slots.container}>
            <div className={tableMetadataStyles.slots.operations}>
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
            <ul className={tableMetadataStyles.slots["active-filters"]}>
                {props.filters.map((x) => (
                    <li key={`filter-table-${x.id}`} className={tableMetadataStyles.slots.pill}>
                        <span>
                            <span className={tableMetadataStyles.slots.dot} aria-hidden="true" />
                            {x.label} {x.operation.label.toLowerCase()}:
                        </span>
                        <div className={tableMetadataStyles.slots["value-frame"]}>
                            <span aria-hidden="true" className={tableMetadataStyles.slots["ghost-value"]}>
                                {x.value || " "}
                            </span>
                            <input
                                type={x.type}
                                value={x.value as string}
                                className={tableMetadataStyles.slots.input}
                                onChange={(e) => {
                                    const value = valueFromType(e.target);
                                    props.setFilters((prev) => prev.map((item) => (x.id === item.id ? { ...item, value } : item)));
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </header>
);
