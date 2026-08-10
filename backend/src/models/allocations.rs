use crate::models::allocations_item::AllocationItem;
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct Allocation {
    pub(crate) id: i64,
    pub(crate) description: String,
    pub(crate) date_of_entry: NaiveDateTime,
    pub(crate) can_be_outside: Option<bool>,
    pub(crate) category_id: i64,
    pub(crate) storage_box_id: i64,
}

impl Allocation {
    pub fn from_allocation_item(allocation_item: AllocationItem) -> Allocation {
        Allocation { id: allocation_item.id, description: allocation_item.description, date_of_entry: allocation_item.date_of_entry, can_be_outside: allocation_item.can_be_outside, category_id: allocation_item.category_id, storage_box_id: allocation_item.storage_box_id }
    }
}
