using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Snapshot;
using System.Text.Json;


namespace CoordinatorApi.ElasticsearchStorage;

public class ElasticsearchStorageClient(ElasticsearchClient client) : IStorageClient
{
    private static readonly string _indexPrefix = "audit";

    private static readonly Guid _fieldIdEditor = new Guid("badd9cf9-53e0-4d0c-bcc0-2d784c282f6a");

    private string _indexName => $"{_indexPrefix}-{DateTime.UtcNow:yyyy.MM}";

    public async Task Add(string sitecoreInstanceId, SitecoreWebHookModel model, string? raw, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(model, nameof(model));

        var now = DateTime.UtcNow;

        if (raw == null)
        {
            raw = await Serialize(model, cancellationToken) ?? throw new ArgumentException("model was unexpected serialized to null");
        }

        await EnsureIndex(_indexName);

        var fieldIds = model.Changes?.FieldChanges?.Select(x => x.FieldId).ToArray() ?? Array.Empty<Guid>();
        var userName = GetUserName(model);
        var changedFields = await Serialize(model.Changes?.FieldChanges?.Select(x => new { field = x.FieldId, from = x.OriginalValue, to = x.Value }).ToArray(), cancellationToken);
        var fields = new IndexChangeModel
        {
            Timestamp = now,
            EventName = model.EventName,
            Raw = raw,
            ItemId = model.Item?.Id ?? Guid.Empty,
            Version = model.Item?.Version ?? 0,
            ParentId = model.Item?.ParentId ?? Guid.Empty,
            Language = model.Item?.Language,
            SitecoreInstance = sitecoreInstanceId,
            FieldIds = fieldIds,
            ChangedFields = changedFields,
            User = userName,
        };

        var response = await client.CreateAsync(fields, opt => opt.Index(_indexName).Id(Guid.NewGuid()));

        if (!response.IsValidResponse)
        {
            if (response.TryGetOriginalException(out var ex) && ex != null)
            {
                throw ex;
            }

            throw new Exception("Unknown communication error while writing data.");
        }
    }

    private static string? GetUserName(SitecoreWebHookModel model)
    {
        var userName = model.Changes?.FieldChanges?.FirstOrDefault(x => x.FieldId == _fieldIdEditor)?.Value;

        if (string.IsNullOrEmpty(userName))
        {
            userName = model.Item?.VersionedFields?.FirstOrDefault(x => x.Id == _fieldIdEditor)?.Value;
        }

        if (string.IsNullOrEmpty(userName))
        {
            userName = model.Item?.UnversionedFields?.FirstOrDefault(x => x.Id == _fieldIdEditor)?.Value;
        }

        return userName;
    }

    private static async Task<string?> Serialize<T>(T model, CancellationToken cancellationToken)
    {
        if (model == null)
        {
            return null;
        }

        using var stream = new MemoryStream();

        await JsonSerializer.SerializeAsync(stream, model, cancellationToken: cancellationToken);

        using var reader = new StreamReader(stream);

        var result = await reader.ReadToEndAsync(cancellationToken);

        return result;
    }

    private async Task EnsureIndex(string indexName)
    {
        var response = await client.Indices.CreateAsync(indexName);

        if (!response.IsValidResponse)
        {
            // Ignore if index already exists
            if (response.ElasticsearchServerError?.Status != 400)
            {
                if (response.TryGetOriginalException(out var ex) && ex != null)
                {
                    throw ex;
                }

                throw new Exception("Unknown communication error while ensuring index.");
            }
        }
    }
}
