use rocket::serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct MultiQuery{
    pub ids: Vec<u8>,
}