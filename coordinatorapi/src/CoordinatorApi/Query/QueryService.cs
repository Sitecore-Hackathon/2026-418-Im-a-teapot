using CoordinatorApi.Shared;
using Elastic.Clients.Elasticsearch;

namespace CoordinatorApi.Query;

public class QueryService(ElasticsearchClient client)
{
    private string _indexName => $"audit-{DateTime.UtcNow:yyyy.MM}";

    public async Task<IEnumerable<IndexChangeModel>> GetItems(string sitecoreInstanceId, string ids, HttpContext http, CancellationToken cancellationToken)
    {
        var response = await client.SearchAsync<IndexChangeModel>(s => s
            .Indices(_indexName)
            .From(0)
            .Size(100)
            .Query(q => q
                .Term(t => t
                    .Field(x => x.SitecoreInstance)
                    .Value(sitecoreInstanceId)
                )
            )
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
