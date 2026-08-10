use crate::models::category::Category;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryItem {
    pub(crate) id: i64,
    pub(crate) comment: String,
}

impl CategoryItem {
    pub fn from_category(category: Category) -> CategoryItem {
        CategoryItem { id: category.id, comment: category.comment }
    }
}
