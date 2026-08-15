PRAGMA foreign_keys = OFF;
PRAGMA defer_foreign_keys = ON;
-- Written using https://www.sqlite.org/lang_altertable.html#making_other_kinds_of_table_schema_changes
create table new_storage_boxes
(
    id        INTEGER PRIMARY KEY not null,
    place     TEXT                not null
);
create table new_allocations
(
    id             INTEGER PRIMARY KEY not null,
    description    TEXT                not null,
    date_of_entry  datetime            not null,
    can_be_outside boolean,
    storage_box_id INTEGER             not null,
    FOREIGN KEY (storage_box_id) REFERENCES storage_boxes (id)
);
create table temp_transactions
(
    id            INTEGER PRIMARY KEY not null,
    allocation_id INTEGER             not null,
    item_delta    integer             not null,
    date          datetime            not null
);
insert into new_storage_boxes select id, place from storage_boxes;
insert into new_allocations select id, description, date_of_entry, can_be_outside, storage_box_id from allocations;
insert into temp_transactions select id, allocation_id, item_delta, date from transactions;
drop table allocations;
drop table storage_boxes;
drop table categories;
drop table item_types;
ALTER TABLE new_storage_boxes RENAME TO storage_boxes;
ALTER TABLE new_allocations RENAME TO allocations;
PRAGMA defer_foreign_keys = OFF;
PRAGMA foreign_keys = TRUE;