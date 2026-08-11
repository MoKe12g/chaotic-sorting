use crate::storage_system::storage_system::StorageSystem;
use crate::webapi::{allocations, high_level, storage_boxes, transactions};
use rocket::{routes, Error, Ignite, Rocket};

pub struct API
{
    storage_system: StorageSystem,
}

impl API {
    pub fn new(storage_system: StorageSystem) -> API {
        API { storage_system }
    }

    pub(crate) async fn run(&self) -> anyhow::Result<Rocket<Ignite>, Error> {
        rocket::build()
            .manage(AppState { storage_system: self.storage_system.clone() })
            .mount(
                "/",
                routes![
                    storage_boxes::get_storage_box,
                    storage_boxes::get_storage_box_by_id,
                    storage_boxes::patch_storage_box,
                    storage_boxes::delete_storage_box,
                    storage_boxes::post_storage_box,
                    storage_boxes::count_storage_box_entries,
                    allocations::get_allocation,
                    allocations::get_allocation_by_id,
                    //allocations::multi_get,
                    allocations::patch_allocation,
                    allocations::delete_allocation,
                    allocations::post_allocation,
                    allocations::count_allocation_entries,
                    transactions::get_transaction,
                    transactions::get_transaction_by_id,
                    transactions::patch_transaction,
                    transactions::delete_transaction,
                    transactions::post_transaction,
                    transactions::count_transaction_entries,
                    
                    high_level::sum_transaction_items_for_allocation,
                    ],
            )
            .launch().await
    }
}

pub struct AppState {
    storage_system: StorageSystem,
}

impl AppState {
    pub fn get_storage_system(&self) -> &StorageSystem {
        &self.storage_system
    }
}