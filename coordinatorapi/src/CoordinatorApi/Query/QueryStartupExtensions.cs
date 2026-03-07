
using Microsoft.AspNetCore.Mvc;

namespace CoordinatorApi.Query;

public static class QueryStartupExtensions
{
    public static void AddQuery(this WebApplicationBuilder builder)
    {
        builder.Services.AddTransient<QueryService>();
    }

    public static WebApplication MapQuery(this WebApplication app)
    {
        var receiveApi = app.MapGroup("/api/query");

        receiveApi.MapGet("/{sitecoreInstanceId:required}/items", async (string sitecoreInstanceId, [FromQuery] string ids, HttpContext http, [FromServices] QueryService service, CancellationToken cancellationToken) =>
        {
            var items = await service.GetItems(sitecoreInstanceId, ids, http, cancellationToken);

            return items;
        }).ShortCircuit();

        return app;
    }
}
