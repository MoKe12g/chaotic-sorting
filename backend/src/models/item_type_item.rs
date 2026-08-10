use rocket::serde::{Deserialize, Serialize};
use crate::models::item_type::ItemType;

#[derive(Debug, Serialize, Deserialize)]
pub struct ItemTypeItem {
    pub(crate) id: i64,
    pub(crate) storage_property: String,
}

impl ItemTypeItem {
    pub fn from_item_type(item_type: ItemType) -> ItemTypeItem {
        ItemTypeItem { id: item_type.id, storage_property: item_type.storage_property }
    }
}
