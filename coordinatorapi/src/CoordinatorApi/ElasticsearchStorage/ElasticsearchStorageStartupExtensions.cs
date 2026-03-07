
using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Nodes;

namespace CoordinatorApi.ElasticsearchStorage;

public static class ElasticsearchStorageStartupExtensions
{
    public static void AddElasticsearchStorage(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton(sp =>
        {
            var settings = sp.GetRequiredService<IConfiguration>().GetSection(ElasticsearchSettings.Key).Get<ElasticsearchSettings>();

            if (settings == null)
            {
                throw new InvalidOperationException("Missing configuration.");
            }

            var clientSettings = new ElasticsearchClientSettings(settings.Uri);

            clientSettings.ServerCertificateValidationCallback((sender, certificate, chain, sslPolicyErrors) => true);

            return new ElasticsearchClient(clientSettings);
        });

        builder.Services.AddTransient<IStorageClient, ElasticsearchStorageClient>();
    }
}

