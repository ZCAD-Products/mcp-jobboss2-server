use anyhow::{anyhow, Context, Result};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use reqwest::Method;
use serde::Deserialize;
use serde_json::{json, Value};
use std::time::{Duration, Instant};
use tokio::sync::RwLock;

use crate::config::Config;

pub struct NativeTools {
    http: reqwest::Client,
    cfg: Config,
    token: RwLock<Option<(String, Instant)>>,
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
    expires_in: Option<u64>,
}

impl NativeTools {
    pub fn new(cfg: Config) -> Result<Self> {
        let http = reqwest::Client::builder()
            .timeout(Duration::from_millis(cfg.timeout_ms))
            .pool_max_idle_per_host(32)
            .tcp_nodelay(true)
            .build()
            .context("failed to build reqwest client")?;
        Ok(Self {
            http,
            cfg,
            token: RwLock::new(None),
        })
    }

    pub fn supports(name: &str) -> bool {
        matches!(
            name,
            "get_orders"
                | "get_order_by_id"
                | "get_customers"
                | "get_customer_by_code"
                | "get_quotes"
                | "get_quote_by_id"
                | "get_materials"
                | "get_material_by_part_number"
                | "get_employees"
                | "custom_api_call"
        )
    }

    pub async fn call(&self, name: &str, args: Value) -> Result<Value> {
        match name {
            "get_orders" => self.get("/api/v2/orders", query(&args), None).await,
            "get_order_by_id" => {
                self.get(
                    &format!("/api/v2/orders/{}", req_str(&args, "orderNumber")?),
                    vec![],
                    None,
                )
                .await
            }
            "get_customers" => self.get("/api/v2/customers", query(&args), None).await,
            "get_customer_by_code" => {
                self.get(
                    &format!("/api/v2/customers/{}", req_str(&args, "customerCode")?),
                    vec![],
                    None,
                )
                .await
            }
            "get_quotes" => self.get("/api/v2/quotes", query(&args), None).await,
            "get_quote_by_id" => {
                self.get(
                    &format!("/api/v2/quotes/{}", req_str(&args, "quoteNumber")?),
                    vec![],
                    None,
                )
                .await
            }
            "get_materials" => self.get("/api/v2/materials", query(&args), None).await,
            "get_material_by_part_number" => {
                self.get(
                    &format!("/api/v2/materials/{}", req_str(&args, "partNumber")?),
                    vec![],
                    None,
                )
                .await
            }
            "get_employees" => self.get("/api/v2/employees", query(&args), None).await,
            "custom_api_call" => {
                let method = req_str(&args, "method")?.to_uppercase();
                let path = req_str(&args, "path")?;
                if !path.starts_with('/') || path.contains("..") {
                    return Err(anyhow!("invalid path"));
                }
                let method = Method::from_bytes(method.as_bytes()).context("invalid method")?;
                self.request(method, path, query(&args), args.get("body").cloned())
                    .await
            }
            _ => Err(anyhow!("unsupported native tool")),
        }
    }

    async fn token(&self) -> Result<String> {
        if let Some((token, exp)) = self.token.read().await.clone() {
            if exp > Instant::now() {
                return Ok(token);
            }
        }
        let mut w = self.token.write().await;
        if let Some((token, exp)) = w.clone() {
            if exp > Instant::now() {
                return Ok(token);
            }
        }
        let basic = STANDARD.encode(format!("{}:{}", self.cfg.api_key, self.cfg.api_secret));
        let resp = self
            .http
            .post(&self.cfg.oauth_token_url)
            .header("Authorization", format!("Basic {basic}"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body("grant_type=client_credentials")
            .send()
            .await?;
        if !resp.status().is_success() {
            return Err(anyhow!("token fetch failed: {}", resp.status()));
        }
        let token: TokenResponse = resp.json().await?;
        let ttl = token.expires_in.unwrap_or(3600).saturating_sub(30);
        *w = Some((
            token.access_token.clone(),
            Instant::now() + Duration::from_secs(ttl),
        ));
        Ok(token.access_token)
    }

    async fn get(
        &self,
        path: &str,
        query: Vec<(String, String)>,
        body: Option<Value>,
    ) -> Result<Value> {
        self.request(Method::GET, path, query, body).await
    }

    async fn request(
        &self,
        method: Method,
        path: &str,
        query: Vec<(String, String)>,
        body: Option<Value>,
    ) -> Result<Value> {
        let token = self.token().await?;
        let mut req = self
            .http
            .request(
                method,
                format!("{}{}", self.cfg.api_url.trim_end_matches('/'), path),
            )
            .bearer_auth(token)
            .query(&query);
        if let Some(body) = body {
            req = req.json(&body);
        }
        let resp = req.send().await?;
        let status = resp.status();
        let txt = resp.text().await.unwrap_or_default();
        if !status.is_success() {
            return Err(anyhow!("jobboss2 api error: {status} {txt}"));
        }
        if txt.trim().is_empty() {
            return Ok(Value::Null);
        }
        Ok(serde_json::from_str(&txt).unwrap_or(json!(txt)))
    }
}

fn req_str<'a>(v: &'a Value, key: &str) -> Result<&'a str> {
    v.get(key)
        .and_then(Value::as_str)
        .ok_or_else(|| anyhow!("missing required field: {key}"))
}

fn query(args: &Value) -> Vec<(String, String)> {
    args.get("query")
        .and_then(Value::as_object)
        .map(|q| {
            q.iter()
                .map(|(k, v)| {
                    (
                        k.clone(),
                        v.as_str()
                            .map(str::to_string)
                            .unwrap_or_else(|| v.to_string()),
                    )
                })
                .collect()
        })
        .unwrap_or_default()
}
