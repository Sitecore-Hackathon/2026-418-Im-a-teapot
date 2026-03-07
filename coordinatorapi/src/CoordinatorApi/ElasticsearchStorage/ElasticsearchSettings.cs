namespace CoordinatorApi.ElasticsearchStorage;

public class ElasticsearchSettings
{
    public const string Key = "Elasticsearch";
    public required string CloudId { get; set; }
    public required string ApiKey { get; set; }
}
