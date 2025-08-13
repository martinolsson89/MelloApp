# MelloApp

MelloApp is a full‑stack web application for running prediction games
around music competitions.  Users can register, make predictions on the
placement of artists in each sub‑competition, and follow how many points
they earn as results are published.  The application calculates scores,
builds leaderboards and manages general content shown on the site.

## Tech stack

### Backend

- **ASP.NET Core 8** Web API
- **Entity Framework Core** with SQL Server
- **ASP.NET Core Identity** for authentication and authorization
- **AutoMapper** for object‑mapping
- **SendGrid**, **Azure Blob Storage** and **Swashbuckle** integrations

### Frontend

- **React 18** with **TypeScript**
- **Vite** development server and build tool
- **Material‑UI** component library
- **React Router** and **i18next** for routing and localisation

The backend source lives in `MelloApp.Server` and the front end in
`melloapp.client`.

## Development

Run the test suite:

```bash
dotnet test
```