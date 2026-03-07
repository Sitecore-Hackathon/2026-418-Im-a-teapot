using System.Threading.Channels;

namespace CoordinatorApi.Receive;

public class WebhookReceiveService(ChannelWriter<ReceivedWebhookData> channel, ILogger<WebhookReceiveService> logger)
{
    public async Task Receive(string sitecoreInstanceId, HttpContext http, CancellationToken cancellationToken)
    {
        logger.LogInformation("Received from {SitecoreId}", sitecoreInstanceId);

        using var reader = new StreamReader(http.Request.Body);

        var raw = await reader.ReadToEndAsync(cancellationToken);

        await channel.WriteAsync(new ReceivedWebhookData
        {
            SitecoreInstanceId = sitecoreInstanceId,
            ReceivedData = raw
        }, cancellationToken);
    }
}
