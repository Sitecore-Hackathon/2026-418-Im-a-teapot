
using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;
using Elastic.Transport;

namespace CoordinatorApi.ElasticsearchStorage;

public static class ElasticsearchStorageStartupExtensions
{
    public static void AddElasticsearchStorage(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton(sp =>
        {
            var settings = sp.GetRequiredService<IConfiguration>().GetSection(ElasticsearchSettings.Key).Get<ElasticsearchSettings>() ?? throw new InvalidOperationException("Missing configuration.");

            return new ElasticsearchClient(settings.CloudId, new ApiKey(settings.ApiKey));
        });

        builder.Services.AddTransient<IStorageClient, ElasticsearchStorageClient>();
    }
}

