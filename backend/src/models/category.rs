use crate::models::category_item::CategoryItem;

#[derive(Debug, Clone)]
pub struct Category {
    pub(crate) id: i64,
    pub(crate) comment: String,
}

impl Category {
    pub fn from_category_item(category_item: CategoryItem) -> Category {
        Category { id: category_item.id, comment: category_item.comment }
    }
}
