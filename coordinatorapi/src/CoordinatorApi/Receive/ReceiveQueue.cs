using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using CoordinatorApi.Shared;

namespace CoordinatorApi.Receive;

public struct ReceivedWebhookData
{
    public string SitecoreInstanceId { get; init; }

    public string ReceivedData { get; init; }
}

public class QueuedHostedService : BackgroundService
{
    private readonly ChannelReader<ReceivedWebhookData> _channel;
    private readonly IStorageClient _client;
    private readonly ILogger<QueuedHostedService> _logger;

    public QueuedHostedService(ChannelReader<ReceivedWebhookData> channel, IStorageClient client, ILogger<QueuedHostedService> logger)
    {
        _channel = channel;
        _client = client;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var data in _channel.ReadAllAsync(stoppingToken))
        {
            try
            {
                var id = data.SitecoreInstanceId;
                var raw = data.ReceivedData;
                using var stream = new MemoryStream(Encoding.UTF8.GetBytes(raw));
                var model = await JsonSerializer.DeserializeAsync<SitecoreWebHookModel>(stream, cancellationToken: stoppingToken);

                if (model == null)
                {
                    continue;
                }

                await _client.Add(id, model, raw);

                _logger.LogInformation("Stored {EventName} from {SitecoreId}: {Raw}", model.EventName, id, raw);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not process event {EventData} due to {Error}", data.ReceivedData, ex.Message);
            }
        }
    }
}
