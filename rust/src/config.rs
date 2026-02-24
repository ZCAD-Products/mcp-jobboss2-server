use anyhow::{Context, Result};

#[derive(Clone, Debug)]
pub struct Config {
    pub api_url: String,
    pub api_key: String,
    pub api_secret: String,
    pub oauth_token_url: String,
    pub timeout_ms: u64,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Self {
            api_url: std::env::var("JOBBOSS2_API_URL").context("JOBBOSS2_API_URL is required")?,
            api_key: std::env::var("JOBBOSS2_API_KEY").context("JOBBOSS2_API_KEY is required")?,
            api_secret: std::env::var("JOBBOSS2_API_SECRET")
                .context("JOBBOSS2_API_SECRET is required")?,
            oauth_token_url: std::env::var("JOBBOSS2_OAUTH_TOKEN_URL")
                .context("JOBBOSS2_OAUTH_TOKEN_URL is required")?,
            timeout_ms: std::env::var("API_TIMEOUT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(30_000),
        })
    }
}
