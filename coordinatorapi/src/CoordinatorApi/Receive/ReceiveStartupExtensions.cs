using CoordinatorApi.Shared;
using System.Threading.Channels;

namespace CoordinatorApi.Receive;

public static class ReceiveStartupExtensions
{
    public static void AddReceive(this WebApplicationBuilder builder)
    {
        builder.Services.AddHostedService<QueuedHostedService>();
        builder.Services.AddSingleton(_ => Channel.CreateUnbounded<ReceivedWebhookData>());
        builder.Services.AddSingleton(sp => sp.GetRequiredService<Channel<ReceivedWebhookData>>().Reader);
        builder.Services.AddSingleton(sp => sp.GetRequiredService<Channel<ReceivedWebhookData>>().Writer);
        builder.Services.AddSingleton<WebhookReceiveService>();
        builder.Services.AddSingleton<IStorageClient, InMemoryStorageClient>();
    }

    public static WebApplication MapReceive(this WebApplication app)
    {
        var receiveApi = app.MapGroup("/api/receive");

        receiveApi.MapPost("/hook/{sitecoreInstanceId:required}", async (string sitecoreInstanceId, HttpContext http, WebhookReceiveService service, CancellationToken cancellationToken) =>
        {
            await service.Receive(sitecoreInstanceId, http, cancellationToken);

            return Results.Accepted();
        }).ShortCircuit();

        return app;
    }
}
