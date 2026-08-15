use crate::models::transaction::Transaction;
use crate::webapi::naivedatetime_deserialization::deserialize_datetime;
use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionItem {
    pub(crate) id: i64,
    pub(crate) allocation_id: i64,
    pub(crate) item_delta: i64,
    #[serde(deserialize_with = "deserialize_datetime")]
    pub(crate) date: NaiveDateTime,
}

impl TransactionItem {
    pub fn from_transaction(transaction: Transaction) -> TransactionItem {
        TransactionItem { id: transaction.id, allocation_id: transaction.allocation_id, item_delta: transaction.item_delta, date: transaction.date }
    }
}
