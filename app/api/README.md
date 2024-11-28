Authentication
Some endpoints require authentication using Clerk. Ensure you include the necessary authentication headers (e.g., Authorization: Bearer <token>) when making requests to these endpoints.

Endpoints
POST /api/aurora/contract-details
Description
Fetches contract details for a list of contracts specified by notice IDs and optional lot IDs.

Authentication
Required

Request
Method: POST
URL: /api/aurora/contract-details

Headers:
Content-Type: application/json
Authorization: Bearer <token>
Body:
{
  "contracts": [
    {
      "noticeId": "string",
      "lotId": "string (optional)"
    }
  ]
}
Response
Status Code: 200 OK

Body:
{
  "contracts": [
    {
      "record_id": "string",
      "notice_id": "string",
      "title": "string",
      "description": "string",
      "estimated_value": number,
      "currency": "string",
      "country": "string",
      "deadline": "ISO8601 date string",
      "published": "ISO8601 date string",
      "lot_count": number
    }
  ]
}
Error Responses
400 Bad Request: Invalid request format.
401 Unauthorized: Authentication required.
500 Internal Server Error: Server error.

Example
Request
POST /api/aurora/contract-details HTTP/1.1
Host: your-domain.com
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "contracts": [
    { "noticeId": "12345", "lotId": "67890" },
    { "noticeId": "54321" }
  ]
}
Response
{
  "contracts": [
    {
      "record_id": "12345_67890",
      "notice_id": "12345",
      "title": "Contract Title",
      "description": "Contract Description",
      "estimated_value": 1000000.0,
      "currency": "USD",
      "country": "US",
      "deadline": "2023-12-31T23:59:59Z",
      "published": "2023-01-01T00:00:00Z",
      "lot_count": 3
    },
    {
      "record_id": "54321",
      "notice_id": "54321",
      "title": "Another Contract Title",
      "description": "Another Contract Description",
      "estimated_value": 500000.0,
      "currency": "EUR",
      "country": "DE",
      "deadline": "2024-06-30T23:59:59Z",
      "published": "2023-06-01T00:00:00Z",
      "lot_count": 1
    }
  ]
}
POST /api/aurora/liked-basic
Description
Fetches basic contract details for a specific notice ID, typically used for liked contracts.

Authentication
Required

Request
Method: POST

URL: /api/aurora/liked-basic

Headers:

Content-Type: application/json
Authorization: Bearer <token>
Body:

json
Copy code
{
  "noticeId": "string"
}
Response
Status Code: 200 OK

Body:

json
Copy code
{
  "noticeId": "string",
  "noticePublicationId": "string",
  "title": "string",
  "description": "string",
  "estimatedValue": number,
  "currency": "string",
  "country": "string",
  "published": "ISO8601 date string",
  "deadline": "ISO8601 date string",
  "lot_count": number
}
Error Responses
400 Bad Request: Notice ID is required.
401 Unauthorized: Authentication required.
404 Not Found: Contract not found.
500 Internal Server Error: Server error.
Example
Request
http
Copy code
POST /api/aurora/liked-basic HTTP/1.1
Host: your-domain.com
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "noticeId": "12345"
}
Response
json
Copy code
{
  "noticeId": "12345",
  "noticePublicationId": "NPID-67890",
  "title": "Contract Title",
  "description": "Contract Description",
  "estimatedValue": 1000000.0,
  "currency": "USD",
  "country": "US",
  "published": "2023-01-01T00:00:00Z",
  "deadline": "2023-12-31T23:59:59Z",
  "lot_count": 3
}
POST /api/aurora/specific-contract
Description
Fetches detailed contract information for a specific notice ID, including lots and buyers.

Authentication
Required

Request
Method: POST

URL: /api/aurora/specific-contract

Headers:

Content-Type: application/json
Authorization: Bearer <token>
Body:

json
Copy code
{
  "noticeId": "string"
}
Response
Status Code: 200 OK

Body:

json
Copy code
{
  "noticeId": "string",
  "noticePublicationId": "string",
  "title": "string",
  "description": "string",
  "estimatedValue": number,
  "currency": "string",
  "country": "string",
  "published": "ISO8601 date string",
  "deadline": "ISO8601 date string",
  "attachmentUri": "string",
  "lots": [
    {
      "lotId": "string",
      "title": "string",
      "description": "string",
      "procurementType": "string",
      "estimatedValue": number
    }
  ],
  "buyers": [
    {
      "name": "string",
      "website": "string",
      "phone": "string",
      "email": "string",
      "address_city": "string",
      "address_street": "string",
      "address_postal": "string",
      "address_country": "string"
    }
  ]
}
Error Responses
400 Bad Request: Notice ID is required.
401 Unauthorized: Authentication required.
404 Not Found: Contract not found.
500 Internal Server Error: Server error.
Example
Request
http
Copy code
POST /api/aurora/specific-contract HTTP/1.1
Host: your-domain.com
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "noticeId": "12345"
}
Response
json
Copy code
{
  "noticeId": "12345",
  "noticePublicationId": "NPID-67890",
  "title": "Contract Title",
  "description": "Contract Description",
  "estimatedValue": 1000000.0,
  "currency": "USD",
  "country": "US",
  "published": "2023-01-01T00:00:00Z",
  "deadline": "2023-12-31T23:59:59Z",
  "attachmentUri": "http://example.com/attachment.pdf",
  "lots": [
    {
      "lotId": "LOT-1",
      "title": "Lot Title 1",
      "description": "Lot Description 1",
      "procurementType": "Goods",
      "estimatedValue": 500000.0
    },
    {
      "lotId": "LOT-2",
      "title": "Lot Title 2",
      "description": "Lot Description 2",
      "procurementType": "Services",
      "estimatedValue": 500000.0
    }
  ],
  "buyers": [
    {
      "name": "Buyer Name",
      "website": "http://buyerwebsite.com",
      "phone": "+1-555-1234",
      "email": "contact@buyer.com",
      "address_city": "New York",
      "address_street": "123 Main St",
      "address_postal": "10001",
      "address_country": "US"
    }
  ]
}
POST /api/autofill
Description
Processes a domain name to fetch relevant information, useful for auto-filling data.

Authentication
Not Required

Request
Method: POST

URL: /api/autofill

Headers:

Content-Type: application/json
Body:

json
Copy code
{
  "domain": "string"
}
Response
Status Code: 200 OK

Body:

json
Copy code
{
  "results": [
    {
      // Structure depends on domain information
    }
  ]
}
Error Responses
400 Bad Request: Domain is required.
500 Internal Server Error: Server error.
Example
Request
http
Copy code
POST /api/autofill HTTP/1.1
Host: your-domain.com
Content-Type: application/json

{
  "domain": "example.com"
}
Response
json
Copy code
{
  "results": [
    {
      "companyName": "Example Inc.",
      "website": "http://example.com",
      "contactEmail": "info@example.com",
      "address": "123 Example Street"
      // Additional fields...
    }
  ]
}
POST /api/like-tender
Description
Likes or unlikes a tender (contract). If the tender is already liked, it will be unliked, and vice versa.

Authentication
Required

Request
Method: POST

URL: /api/like-tender

Headers:

Content-Type: application/json
Authorization: Bearer <token>
Body:

json
Copy code
{
  "contractNoticeId": "string"
}
Response
Status Code: 200 OK

Body:

json
Copy code
{
  "liked": true | false
}
Error Responses
400 Bad Request: Contract notice ID is required.
401 Unauthorized: Authentication required.
404 Not Found: User not found.
500 Internal Server Error: Server error.
Example
Request
http
Copy code
POST /api/like-tender HTTP/1.1
Host: your-domain.com
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "contractNoticeId": "12345"
}
Response
json
Copy code
{
  "liked": true
}

/api/similarity-search
Method: POST
Description: Searches for contracts matching the user's company profile and fetches contract details.

Request
Authentication: Required (via Clerk).
Headers: Authorization header must be included.
Body: None.
Response
200 OK: Returns a list of matching contracts with details.
json
Copy code
{
  "contracts": [
    {
      "notice_id": "123",
      "title": "Contract Title",
      "description": "Contract description...",
      "amount": 100000,
      "currency": "USD",
      "country": "Germany",
      "status": "green",
      "match_percentage": 85,
      "published": "2024-01-01",
      "lot_count": 2,
      "deadline": "2024-12-31",
      "is_liked": true
    }
  ]
}
401 Unauthorized: If the user is not authenticated.
500 Internal Server Error: On any failure.
/api/subscription-status
Method: GET
Description: Checks if the user has an active subscription.

Request
Authentication: Required (via Clerk).
No request body required.
Response
200 OK: Returns a JSON object indicating subscription status.
json
Copy code
{ "hasActiveSubscription": true }
401 Unauthorized: If the user is not authenticated.
404 Not Found: If the user profile is not found.
/api/upload-files
Method: POST
Description: Uploads user files to AWS S3 and stores file metadata in the database.

Request
Authentication: Required (via Clerk).
Body: JSON array of file objects.
json
Copy code
{
  "companyId": "123",
  "files": [
    {
      "name": "file.pdf",
      "content": "data:application/pdf;base64,...",
      "size": 12345,
      "type": "application/pdf"
    }
  ]
}
Response
200 OK: Returns metadata of uploaded files.
json
Copy code
{
  "success": true,
  "files": [
    {
      "id": 1,
      "fileUrl": "https://bucket.s3.region.amazonaws.com/key",
      "size": 12345,
      "contentType": "application/pdf"
    }
  ]
}
401 Unauthorized: If the user is not authenticated.
400 Bad Request: If no files or companyId are provided.
500 Internal Server Error: On any failure.
/api/webhooks/stripe
Method: POST
Description: Handles Stripe webhook events for subscription updates.

Request
Authentication: Not required.
Headers: Must include Stripe-Signature.
Body: Raw Stripe event payload.
Response
200 OK: On successful processing of the event.
400 Bad Request: If the signature or event is invalid.
500 Internal Server Error: On any other failure.