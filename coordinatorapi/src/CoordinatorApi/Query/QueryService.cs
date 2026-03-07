using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace CoordinatorApi.Query;

public class QueryService(ElasticsearchClient client)
{
    private string _indexName => $"audit-{DateTime.UtcNow:yyyy.MM}";

    public async Task<IEnumerable<IndexChangeModel>> GetItems(string sitecoreInstanceId, string ids, HttpContext http, CancellationToken cancellationToken)
    {
        var itemIds = new List<FieldValue>();

        foreach (var id in ids.Split(';'))
        {
            itemIds.Add(FieldValue.String(id));
        }

        var response = await client.SearchAsync<IndexChangeModel>(s => s
            .Indices(_indexName)
            .From(0)
            .Size(100)
            .Query(q => q
                .Bool(b => b
                    .Filter(
                        f => f.MatchPhrase(mp => mp
                            .Field("sitecoreInstance.keyword")
                            .Query(sitecoreInstanceId)
                        ), f => f.Terms(t => t
                            .Field("itemId.keyword")
                            .Terms(new TermsQueryField(itemIds))
                        )
                    )
                )
            )
            .Sort(ss => ss.Field(f => f.Timestamp, SortOrder.Desc))
        );

        if (!response.IsValidResponse)
        {
            if (response.TryGetOriginalException(out var ex) && ex != null)
            {
                throw ex;
            }

            throw new Exception("Communication error while querying data.");
        }

        return response.Documents;
    }

}
