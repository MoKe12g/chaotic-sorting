use crate::models::transaction_item::TransactionItem;
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct Transaction {
    pub(crate) id: i64,
    pub(crate) allocation_id: i64,
    pub(crate) item_delta: i64,
    pub(crate) date: NaiveDateTime,
}

impl Transaction {
    pub fn from_transaction_item(transaction_item: TransactionItem) -> Transaction {
        Transaction { id: transaction_item.id, allocation_id: transaction_item.allocation_id, item_delta: transaction_item.item_delta, date: transaction_item.date }
    }
}
