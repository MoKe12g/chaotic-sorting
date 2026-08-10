use crate::models::allocations::Allocation;
use crate::webapi::naivedatetime_deserialization::deserialize_datetime;
use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AllocationItem {
    pub(crate) id: i64,
    pub(crate) description: String,
    #[serde(deserialize_with = "deserialize_datetime")]
    pub(crate) date_of_entry: NaiveDateTime,
    pub(crate) can_be_outside: Option<bool>,
    pub(crate) storage_box_id: i64,
}

impl AllocationItem {
    pub fn from_allocation(allocation: Allocation) -> AllocationItem {
        AllocationItem { id: allocation.id, description: allocation.description, date_of_entry: allocation.date_of_entry, can_be_outside: allocation.can_be_outside, storage_box_id: allocation.storage_box_id }
    }
}
