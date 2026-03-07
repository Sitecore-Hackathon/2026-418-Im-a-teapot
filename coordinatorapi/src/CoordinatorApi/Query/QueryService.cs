using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Text;
using System.Text.Json;

namespace CoordinatorApi.Query;

public class QueryService(ElasticsearchClient client)
{
    private string _indexName => $"audit-{DateTime.UtcNow:yyyy.MM}";

    public async Task<ItemsQueryResult> GetItems(string sitecoreInstanceId, ItemQueryModel ids, CancellationToken cancellationToken)
    {
        var itemIds = new List<FieldValue>();

        foreach (var id in ids.Ids)
        {
            itemIds.Add(FieldValue.String(id));
        }

        var response = await client.SearchAsync<IndexChangeModel>(s => s
            .Indices(_indexName)
            .From(0)
            .Size(1000)
            .Query(q => q
                .Bool(b =>
                {
                    b.Filter(
                        f => f.MatchPhrase(mp => mp
                            .Field("sitecoreInstance.keyword")
                            .Query(sitecoreInstanceId)
                        )
                    );

                    if (itemIds.Count > 0)
                    {
                        b.Filter(f => f.Terms(t => t
                            .Field("itemId.keyword")
                            .Terms(new TermsQueryField(itemIds))
                        ));
                    }
                })
            )
            .Sort(ss => ss.Field(f => f.Timestamp, SortOrder.Desc))
        , cancellationToken);

        if (!response.IsValidResponse)
        {
            if (response.TryGetOriginalException(out var ex) && ex != null)
            {
                throw ex;
            }

            throw new Exception("Communication error while querying data.");
        }

        var results = new ItemsQueryResult();

        foreach (var hit in response.Hits)
        {
            var document = hit.Source;

            if (document == null)
            {
                continue;
            }

            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(document.Raw));
            var model = await JsonSerializer.DeserializeAsync<SitecoreWebHookModel>(stream, cancellationToken: cancellationToken);

            if (model == null)
            {
                continue;
            }

            results.Items.Add(new ItemResult(
                document.Timestamp,
                hit.Id,
                document.User,
                document.WorkflowId,
                document.WorkflowStateId,
                model));
        }

        return results;
    }

    public class ItemsQueryResult
    {
        public IList<ItemResult> Items { get; set; } = [];
    }

    public record ItemResult(DateTime Timestamp, string StorageId, string? User, string? WorkflowId, string? WorkflowStateId, SitecoreWebHookModel WebHookData);
}
