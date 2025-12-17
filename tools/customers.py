from typing import Any, Dict, List, Optional, Union
from fastmcp import FastMCP
from jobboss2_client import JobBOSS2Client

def register_customer_tools(mcp: FastMCP, client: JobBOSS2Client):
    @mcp.tool()
    async def get_customers(
        fields: str = None,
        sort: str = None,
        skip: int = None,
        take: int = 200,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Retrieve a list of customers from JobBOSS2. Supports filtering, sorting, pagination, and field selection."""
        params = {"fields": fields, "sort": sort, "skip": skip, "take": take, **kwargs}
        params = {k: v for k, v in params.items() if v is not None}
        return await client.get_customers(params)

    @mcp.tool()
    async def get_customer_by_code(customerCode: str, fields: str = None) -> Dict[str, Any]:
        """Retrieve a specific customer by their customer code."""
        params = {"fields": fields} if fields else None
        return await client.get_customer_by_code(customerCode, params)

    @mcp.tool()
    async def create_customer(
        customerCode: str,
        customerName: str,
        phone: str = None,
        billingAddress1: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a new customer in JobBOSS2."""
        data = {
            "customerCode": customerCode,
            "customerName": customerName,
            "phone": phone,
            "billingAddress1": billingAddress1,
            **kwargs
        }
        data = {k: v for k, v in data.items() if v is not None}
        return await client.api_call("POST", "customers", data=data)

    @mcp.tool()
    async def update_customer(
        customerCode: str,
        customerName: str = None,
        phone: str = None,
        billingAddress1: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Update an existing customer in JobBOSS2."""
        data = {
            "customerName": customerName,
            "phone": phone,
            "billingAddress1": billingAddress1,
            **kwargs
        }
        data = {k: v for k, v in data.items() if v is not None}
        return await client.api_call("PATCH", f"customers/{customerCode}", data=data)

