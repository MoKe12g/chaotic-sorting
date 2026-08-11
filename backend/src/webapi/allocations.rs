use crate::models::allocations::Allocation;
use crate::models::allocations_item::AllocationItem;
use crate::models::response::{EntriesCountResponse, MessageResponse};
use crate::webapi::api;
use rocket::response::status::BadRequest;
use rocket::serde::json::Json;
use rocket::{State, delete, get, patch, post};
use sqlx::query_as;
use sqlx_conditional_queries::conditional_query_as;
use crate::models::multi_query::MultiQuery;

#[get("/allocations?<limit>&<page>&<storage_box_id>&<can_be_outside>&<description>")]
pub(crate) async fn get_allocation(app_state: &State<api::AppState>,
                                   limit: Option<i64>,
                                   page: Option<i64>,
                                   storage_box_id:Option<i64>,
                                   can_be_outside: Option<bool>,
                                   description: Option<String>) -> Result<Json<Vec<AllocationItem>>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();

    // calculate pagination
    let page = page.unwrap_or(0);
    let new_limit = limit.unwrap_or(64);
    let offset = new_limit * page;

    match conditional_query_as!(Allocation,
        r#"SELECT *
        FROM allocations
        WHERE 1
        {#storage_box_id}
        {#can_be_outside}
        {#description}
        ORDER BY id ASC
        {#pagination};"#,
        #storage_box_id = match storage_box_id {
            Some(_) =>
                "AND storage_box_id = {storage_box_id}",
            None => "",
        },
        #can_be_outside = match can_be_outside {
            Some(_) =>
                "AND can_be_outside = {can_be_outside}",
            None => "",
        },
        #description = match description.as_ref() {
            Some(_) =>
                "AND description LIKE '%' || {description} || '%'",
            None => "",
        },
        #pagination = match limit {
            Some(_) =>
                "LIMIT {new_limit} OFFSET {offset}",
            None => "",
        },
    ).fetch_all(storage_system.get_database()).await {
        Ok(result) => {
            let result: Vec<Allocation> = result;
            Ok(Json(result.into_iter().map(|f| { AllocationItem::from_allocation(f) }).collect()))
        }
        Err(err) => Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" })))
    }
}

#[get("/allocations/<id>")]
pub(crate) async fn get_allocation_by_id(app_state: &State<api::AppState>, id: i64) -> Result<Json<AllocationItem>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    let allocation_from_id = Allocation::from(storage_system, id).await;
    match allocation_from_id {
        Ok(allocation_from_id) => {
            match allocation_from_id{
                Some(allocation_from_id) => { Ok(Json(AllocationItem::from_allocation(allocation_from_id))) },
                None => Err(BadRequest(Json(MessageResponse { message: "Backend returned no value".into() })))
            }
        },
        Err(err) => Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" })))
    }
}

/* not possible because I cannot add a Array of numbers to the sqlx query
/// multi get
#[post("/allocations-multi", data = "<ids>")]
pub(crate) async fn multi_get(app_state: &State<api::AppState>, ids: Json<MultiQuery>) -> Result<Json<Vec<AllocationItem>>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    match sqlx::query_as!(Allocation,
            "SELECT * from allocations where id in (?1)", ids.ids).fetch_all(storage_system.get_database()).await {
        Ok(result) => {
            let result: Vec<Allocation> = result;
            Ok(Json(result.into_iter().map(|f| { AllocationItem::from_allocation(f) }).collect()))
        }
        Err(err) => Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" })))
    }
}
*/

/// creates entry
#[post("/allocations", data = "<input>")]
pub async fn post_allocation(app_state: &State<api::AppState>, input: Json<AllocationItem>) -> Result<Json<AllocationItem>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    // TODO: Is there a better way than to just discard the given id?
    let input = input.into_inner();
    match Allocation::create(storage_system, input.description, input.date_of_entry, input.can_be_outside, input.storage_box_id).await {
        Ok(result) => { Ok(Json(AllocationItem::from_allocation(result))) }
        Err(err) => { Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" }))) }
    }
}

/// updates entry
#[patch("/allocations/<id>", data = "<input>")]
pub async fn patch_allocation(app_state: &State<api::AppState>, id: i64,
                              input: Json<AllocationItem>) -> Result<Json<AllocationItem>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    let new_value = Allocation { id, description: input.description.clone(), date_of_entry: input.date_of_entry, can_be_outside: input.can_be_outside, storage_box_id: input.storage_box_id }; // make sure that the id is right inside the struct
    match new_value.update(storage_system).await {
        Ok(res) if res.rows_affected() > 0 => Ok(Json(AllocationItem::from_allocation(new_value))),
        Ok(_) => Err(BadRequest(Json(MessageResponse { message: "No rows updated".into() }))),
        Err(err) => { Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" }))) }
    }
}

#[delete("/allocations/<id>")]
pub async fn delete_allocation(app_state: &State<api::AppState>, id: i64) -> Result<Json<AllocationItem>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    match Allocation::from(storage_system, id).await {
        Ok(result) => {
            match result {
                None => { Err(BadRequest(Json(MessageResponse { message: "Cannot find element".to_string() }))) } // BadRequest(Json(MessageResponse { message: "Cannot find id ".to_owned() + &*id.to_string() })))}
                Some(result2) => {
                    let allocation = result2.clone();
                    match result2.delete(&storage_system).await {
                        Ok(_) => { Ok(Json(AllocationItem::from_allocation(allocation))) }
                        Err(err) => Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" })))
                    }
                }
            }
        }
        Err(err) => { Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" }))) }
    }
}

// misc
#[get("/count/allocations")]
pub async fn count_allocation_entries(app_state: &State<api::AppState>) -> Result<Json<EntriesCountResponse>, BadRequest<Json<MessageResponse>>> {
    let storage_system = app_state.get_storage_system();
    let result = query_as!(EntriesCountResponse, "SELECT COUNT(id) AS count, 'allocations' AS 'table' FROM allocations;").fetch_one(storage_system.get_database()).await;
    match result {
        Ok(result) => {
            Ok(Json(result))
        }
        Err(err) => { Err(BadRequest(Json(MessageResponse { message: err.to_string() + " from backend" }))) }
    }
}
