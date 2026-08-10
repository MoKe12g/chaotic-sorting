use crate::models::item_type_item::ItemTypeItem;
use rocket::serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct ItemType {
    pub(crate) id: i64,
    pub(crate) storage_property: String,
}

impl ItemType {
    pub fn from_item_type_item(item_type_item: ItemTypeItem) -> ItemType {
        ItemType { id: item_type_item.id, storage_property: item_type_item.storage_property }
    }
}
