
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

        receiveApi.MapPost("/{sitecoreInstanceId:required}/items", async (string sitecoreInstanceId, [FromBody] ItemQueryModel ids, [FromServices] QueryService service, CancellationToken cancellationToken) =>
        {
            var items = await service.GetItems(sitecoreInstanceId, ids, cancellationToken);

            return items;
        }).ShortCircuit();

        return app;
    }
}

public record ItemQueryModel
{
    public required string[] Ids { get; set; }
}
