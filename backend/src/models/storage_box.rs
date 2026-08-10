use crate::models::storage_box_item::StorageBoxItem;

#[derive(Debug, Clone)]
pub struct StorageBox {
    pub(crate) id: i64,
    pub(crate) place: String,
    pub(crate) item_type: i64,
}

impl StorageBox {
    pub fn from_storage_box_item(storage_box_item: StorageBoxItem) -> StorageBox {
        StorageBox { id: storage_box_item.id, place: storage_box_item.place, item_type: storage_box_item.item_type }
    }
}
