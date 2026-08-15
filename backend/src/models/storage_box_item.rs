use crate::models::storage_box::StorageBox;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StorageBoxItem {
    pub(crate) id: i64,
    pub(crate) place: String,
}

impl StorageBoxItem {
    pub fn from_storage_box(storage_box: StorageBox) -> StorageBoxItem {
        StorageBoxItem { id: storage_box.id, place: storage_box.place }
    }
}
