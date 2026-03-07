namespace CoordinatorApi.ElasticsearchStorage;

public class ElasticsearchSettings
{
    public const string Key = "Elasticsearch";
    public required Uri Uri { get; set; }
}
