import os
import asyncio
from dotenv import load_dotenv
from fastmcp import FastMCP
from jobboss2_client import JobBOSS2Client, JobBOSS2Config

# Import registration functions
from tools.orders import register_order_tools
from tools.customers import register_customer_tools
from tools.quotes import register_quote_tools
from tools.inventory import register_inventory_tools
from tools.employees import register_employee_tools
from tools.production import register_production_tools
from tools.general import register_general_tools
from tools.generated import register_generated_tools

# Load environment variables
load_dotenv()

# Configuration from environment
API_URL = os.getenv("JOBBOSS2_API_URL")
API_KEY = os.getenv("JOBBOSS2_API_KEY")
API_SECRET = os.getenv("JOBBOSS2_API_SECRET")
TOKEN_URL = os.getenv("JOBBOSS2_OAUTH_TOKEN_URL")
API_TIMEOUT = int(os.getenv("API_TIMEOUT", "30"))

if not all([API_URL, API_KEY, API_SECRET, TOKEN_URL]):
    print("Error: Missing required environment variables")
    exit(1)

# Initialize FastMCP
mcp = FastMCP("JobBOSS2", version="3.0.0")

# Initialize JobBOSS2 Client
config = JobBOSS2Config(
    api_url=API_URL,
    api_key=API_KEY,
    api_secret=API_SECRET,
    token_url=TOKEN_URL,
    timeout=API_TIMEOUT
)
client = JobBOSS2Client(config)

# Register all tools
register_order_tools(mcp, client)
register_customer_tools(mcp, client)
register_quote_tools(mcp, client)
register_inventory_tools(mcp, client)
register_employee_tools(mcp, client)
register_production_tools(mcp, client)
register_general_tools(mcp, client)
register_generated_tools(mcp, client)

if __name__ == "__main__":
    # The mcp.run() command handles the stdio transport by default
    mcp.run()

